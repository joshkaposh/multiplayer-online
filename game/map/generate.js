const { frames } = require("../spritesheet.json");

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min) + min);
const ORE_RARITY = (ore) => {
	let rarity;
	switch (ore) {
		case "copper":
			rarity = 0.3;
			break;
		case "iron":
			rarity = 0.5;
			break;
		case "gold":
			rarity = 0.25;
			break;
		default:
			break;
	}

	return rarity;
};
const TILE_RANGES = (cols, rows) => {
	const DIRT_MIN = 5;
	const DIRT_MAX = rows / 4;
	const HARDENED_DIRT_MIN = DIRT_MAX;
	const HARDENED_DIRT_MAX = rows;

	return {
		sky: {
			yMin: 0,
			yMax: DIRT_MIN - 2,
			xMin: 0,
			xMax: cols,
		},

		grass: {
			yMin: DIRT_MIN - 1,
			yMax: DIRT_MIN - 1,
			xMin: 0,
			xMax: cols,
		},
		dirt: {
			yMin: DIRT_MIN,
			yMax: DIRT_MAX,
			xMin: 0,
			xMax: cols,
		},
		hardened_dirt: {
			yMin: HARDENED_DIRT_MIN,
			yMax: HARDENED_DIRT_MAX,
			xMin: 0,
			xMax: cols,
		},
		copper: {
			yMin: DIRT_MIN,
			yMax: DIRT_MAX,
			xMin: 0,
			xMax: cols,
			rarity: ORE_RARITY("copper"),
		},
		iron: {
			yMin: DIRT_MIN,
			yMax: HARDENED_DIRT_MAX,
			xMin: 0,
			xMax: cols,
			rarity: ORE_RARITY("iron"),
		},
		gold: {
			yMin: DIRT_MIN,
			yMax: HARDENED_DIRT_MAX,
			xMin: 0,
			xMax: cols,
			rarity: ORE_RARITY("gold"),
		},
	};
};

const ORE_RANGES = (cols, rows) => {
	let ore_ranges = {};
	const tile_ranges = TILE_RANGES(cols, rows);
	const ranges = Object.keys(TILE_RANGES(cols, rows));
	const oreNames = Object.keys(frames.ores);
	for (let i = 0 - 1; i < ranges.length; i++) {
		let ore = oreNames.filter((name) => name === ranges[i])[0];
		if (ore) {
			ore_ranges[ore] = tile_ranges[ore];
		}
	}

	return ore_ranges;
};

class BaseTile {
	constructor({ x, y, w, h, column, row, frameX, frameY, value, type, walkable }) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.frameX = frameX;
		this.frameY = frameY;
		this.column = column;
		this.row = row;
		this.value = value;
		this.type = type;
	}
}

class BackgroundTile extends BaseTile {
	constructor({ x, y, w, h, column, row, frameX, frameY, value, type }) {
		super({ x, y, w, h, column, row, frameX, frameY, value, type });
	}
}

class Tile extends BaseTile {
	constructor({ x, y, w, h, column, row, frameX, frameY, value, type, walkable, integrity }) {
		super({ x, y, w, h, column, row, frameX, frameY, value, type });
		this.integrity = integrity;
		this.walkable = walkable;
		this.isOre = false;
		this.oreType = null;
		this.oreFrames = {
			col: null,
			row: null,
		};
		// this.neighbours = {};
	}
}

function generateBackgroundLayer(layer, columns, rows, tilesize) {
	let frame, type, value;

	const { grass, sky } = TILE_RANGES(columns, rows);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			value = 0;

			if (y <= sky.yMax) {
				//sky background
				frame = frames.background["sky"];
				type = "sky-bg";
			} else if (y === grass.yMax) {
				//sky-underground background
				frame = frames.background["sky_underground"];
				type = "sky_underground";
			} else {
				//sky-underground background
				frame = frames.background["underground"];
				type = "underground";
			}

			layer.push(
				new BackgroundTile({
					x: x * tilesize,
					y: y * tilesize,
					w: tilesize,
					h: tilesize,
					column: x,
					row: y,
					frameX: frame.col,
					frameY: frame.row,
					value,
					type,
				})
			);
		}
	}
}

function generateTilesLayer(layer, columns, rows, tilesize) {
	let frame = 0;
	let value, integrity, type, walkable;

	const { grass, dirt, hardened_dirt, sky } = TILE_RANGES(columns, rows);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// set default tile values
			walkable = false;
			value = 5;
			integrity = 100;

			if (y <= sky.yMax) {
				//sky
				walkable = true;
				value = 0;
			} else if (y === grass.yMax) {
				//grass
				frame = frames.grass.default;
				value = 4;
				type = "grass";
			} else if (y > 4 && y < dirt.yMax) {
				type = "dirt";
				frame = frames.dirt.default;
			} else if (y === hardened_dirt.yMin) {
				integrity = 200;
				type = "hardened_dirt_topsoil";

				frame = frames.hardened_dirt_topsoil.default;
			} else {
				integrity = 200;
				type = "hardened_dirt";
				frame = frames.hardened_dirt.default;
			}

			layer.push(
				value === 0
					? 0
					: new Tile({
							x: x * tilesize,
							y: y * tilesize,
							w: tilesize,
							h: tilesize,
							column: x,
							row: y,
							frameX: frame.col,
							frameY: frame.row,
							value,
							type,
							walkable,
							integrity,
					  })
			);
		}
	}
}

function addOresToTiles(map, cols, rows) {
	const getTile = (x, y) => map[y * cols + x];
	console.log(frames.ores);

	const RANGES = ORE_RANGES(cols, rows);
	const ores = Object.keys(RANGES);
	for (let i = 0; i < ores.length; i++) {
		// determine ore count
		let frame;
		const ore = RANGES[ores[i]];
		const ORE_ROWS = ore.yMax - ore.yMin;
		let count = ORE_ROWS * cols * ore.rarity;
		console.log(count);

		for (let j = 0; j < count; j++) {
			let x = randomIntFromRange(ore.xMin, ore.xMax);
			let y = randomIntFromRange(ore.yMin, ore.yMax);
			let tile = getTile(x, y);

			if (tile.isOre || tile.type === "hardened_dirt_topsoil") {
				// if tile is between ranges, or already an ore
				x = randomIntFromRange(ore.xMin, ore.xMax);
				y = randomIntFromRange(ore.yMin, ore.yMax);
				tile = getTile(x, y);
			} else {
				tile.integrity += frames.ores[ores[i]].integrity;
				frame = frames.ores[ores[i]];
				tile.oreType = ores[i];
				tile.isOre = true;
				tile.oreFrames.col = frame.col;
				tile.oreFrames.row = frame.row;
			}
		}
	}
}

function generateLayers(cols, rows, tilesize) {
	let layers = [[], []];
	generateBackgroundLayer(layers[0], cols, rows, tilesize);
	generateTilesLayer(layers[1], cols, rows, tilesize);

	return layers;
}

module.exports = {
	generateLayers,
	addOresToTiles,
};
