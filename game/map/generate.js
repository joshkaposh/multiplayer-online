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
console.log(ORE_RANGES(20, 100));

function generateOres(map, cols, rows, mapW, mapH, tilesize) {
	const getTile = (x, y) => map[y * cols + x];

	const RANGES = TILE_RANGES(cols, rows);
	const ores = Object.keys(RANGES);
	for (let i = 0; i < ores.length; i++) {
		// determine ore count
		let frame;
		const ore = RANGES[ores[i]];
		const ORE_ROWS = ore.yMax - ore.yMin;
		let count = ORE_ROWS * cols * ore.rarity;
		ore.count = count;

		for (let j = 0; j < count; j++) {
			let x = randomIntFromRange(ore.xMin, ore.xMax);
			let y = randomIntFromRange(ore.yMin, ore.yMax);
			let tile = getTile(x, y);

			if (tile.type === "hardened_dirt_topsoil" || tile.type === "copper" || tile.type === "iron") {
				x = randomIntFromRange(ore.xMin, ore.xMax);
				y = randomIntFromRange(ore.yMin, ore.yMax);
				tile = getTile(x, y);
			}
			if (tile.type === "hardened_dirt" && frames.ores[ores[i].hardened_dirt]) {
				tile.integrity = frames.ores[ores[i]].integrity.hardened_dirt;
			} else {
				tile.integrity = frames.ores[ores[i]].integrity.dirt;
			}
			frame = frames.ores[ores[i]];
			// console.log(frame);
			tile.type = ores[i];
			tile.frameX = frame.default.col;
			tile.frameY = frame.default.row;
			// console.log(tile);
		}
	}
}

function generateTiles(columns, rows, tilesize, width, height) {
	let map = [];
	let frame = 0;
	let value, integrity, type;

	const { grass, dirt, hardened_dirt, sky, copper, iron } = TILE_RANGES(columns, rows);

	// todo: make ores

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// set default tile values
			value = 5;
			integrity = 100;

			if (y <= sky.yMax) {
				//sky
				frame = frames.walkables.sky;
				integrity = 0;
				value = 0;
				type = "sky";
			}
			if (y === grass.yMax) {
				//grass
				frame = frames.grass.default;
				value = 4;
				type = "grass";
			}

			if (y > 4 && y < dirt.yMax) {
				type = "dirt";
				frame = frames.dirt.default;
			}

			if (y === hardened_dirt.yMin) {
				integrity = 200;
				type = "hardened_dirt_topsoil";
				frame = frames.hardened_dirt.topsoil;
			}
			if (y > hardened_dirt.yMin) {
				integrity = 200;
				type = "hardened_dirt";
				frame = frames.hardened_dirt.default;
			}

			map.push({
				x: x * tilesize,
				y: y * tilesize,
				w: tilesize,
				h: tilesize,
				frameX: frame.col,
				frameY: frame.row,
				column: x,
				row: y,
				value,
				type,
				integrity,
			});
		}
	}
	return map;
}

module.exports = {
	generateTiles,
	generateOres,
};
