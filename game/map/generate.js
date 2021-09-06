const { frames } = require("../spritesheet.json");

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

const { TILE_RANGES, ORE_RANGES, ORE_RARITY } = require("./ore_generate");

class BaseTile {
	constructor({ x, y, w, h, column, row, frameX, frameY, value, type }) {
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
	constructor({ x, y, w, h, column, row, frameX, frameY, value, type, walkable, integrity, toxicity }) {
		super({ x, y, w, h, column, row, frameX, frameY, value, type });
		this.integrity = integrity;
		this.walkable = walkable;
		this.lastDraw = null;
		this.state = {
			ore: {
				repeat: false,
				is: false,
				type: null,
				frames: {
					col: null,
					row: null,
				},
			},
			toxic: {
				repeat: false,
				is: false,
				frames: {
					col: null,
					row: null,
					start: null,
					end: null,
				},
			},
		};
		// type, ore, toxic

		if (toxicity) {
			this.state.toxic.is = true;
			let {
				animation: { start, end, row },
			} = frames.foreground.toxic_cloud;
			this.state.toxic.frames.col = start;
			this.state.toxic.frames.start = start;
			this.state.toxic.frames.end = end;
			this.state.toxic.frames.row = row;
		}
		this.walls = {
			scores: [],
			data: [],
			total: null,
		};

		let sum = 0;

		for (let i = 0; i < 9; i++) {
			let decimal = 0.5;
			this.walls.scores.push(i + decimal);
			this.walls.data.push(true);
			sum += i + decimal;
			this.walls.total = sum;
		}
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
	let value, integrity, type, walkable, toxicity;

	const { grass, dirt, hardened_dirt, sky } = TILE_RANGES(columns, rows);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// set default tile values
			walkable = false;
			toxicity = false;

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
				Math.random() >= 0.5 ? (toxicity = true) : (toxicity = false);
			} else if (y === hardened_dirt.yMin) {
				integrity = 200;
				type = "hardened_dirt_topsoil";
				frame = frames.hardened_dirt_topsoil.default;
				Math.random() >= 0.5 ? (toxicity = true) : (toxicity = false);
			} else {
				integrity = 200;
				type = "hardened_dirt";
				frame = frames.hardened_dirt.default;
				Math.random() >= 0.5 ? (toxicity = true) : (toxicity = false);
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
							toxicity,
					  })
			);
		}
	}
}

function generateEmptyTiles(map, cols, rows) {
	const getTile = (x, y) => map[y * cols + x];

	const { dirt } = TILE_RANGES(cols, rows);

	for (let y = dirt.yMin + 1; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			let tile = getTile(x, y);
		}
	}
}

function addOresToTiles(map, cols, rows) {
	const getTile = (x, y) => map[y * cols + x];

	const RANGES = ORE_RANGES(cols, rows);
	const ores = Object.keys(RANGES);
	for (let i = 0; i < ores.length; i++) {
		// determine ore count
		let frame;
		const ore = RANGES[ores[i]];
		const ORE_ROWS = ore.yMax - ore.yMin;
		let count = ORE_ROWS * cols * ore.rarity;
		console.log("ore: %s, count: %s, range: %s", ores[i], count, ORE_ROWS);

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
				let { ore } = tile.state;
				ore.type = ores[i];
				ore.is = true;
				ore.frames.col = frame.col;
				ore.frames.row = frame.row;
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
