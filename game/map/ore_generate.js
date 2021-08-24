const {
	frames: { ores },
} = require("../spritesheet.json");

const ORE_RARITY = (ore) => {
	let rarity;
	let common = 0.3;
	let uncommon = 0.2;
	let rare = 0.15;
	let super_rare = 0.1;
	switch (ore) {
		case "copper":
			rarity = common;
			break;
		case "iron":
			rarity = common;
			break;
		case "gold":
			rarity = uncommon;
			break;
		case "ruby":
			rarity = rare;
			break;
		case "emerald":
			rarity = super_rare;
			break;
		default:
			break;
	}

	return rarity;
};

const TILE_RANGES = (cols, rows) => {
	const DIRT_MIN = 5;
	const DIRT_MAX = Math.floor(rows / 4);
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
			yMax: HARDENED_DIRT_MAX - Math.floor(DIRT_MAX / 2),
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
		ruby: {
			yMin: DIRT_MIN + Math.floor(DIRT_MAX / 2),
			yMax: HARDENED_DIRT_MAX,
			xMin: 0,
			xMax: cols,
			rarity: ORE_RARITY("ruby"),
		},
		emerald: {
			yMin: HARDENED_DIRT_MIN,
			yMax: HARDENED_DIRT_MAX,
			xMin: 0,
			xMax: cols,
			rarity: ORE_RARITY("emerald"),
		},
	};
};

const ORE_RANGES = (cols, rows) => {
	let ore_ranges = {};
	const tile_ranges = TILE_RANGES(cols, rows);
	const ranges = Object.keys(TILE_RANGES(cols, rows));
	const oreNames = Object.keys(ores);
	for (let i = 0 - 1; i < ranges.length; i++) {
		let ore = oreNames.filter((name) => name === ranges[i])[0];
		if (ore) {
			ore_ranges[ore] = tile_ranges[ore];
		}
	}

	return ore_ranges;
};

module.exports = {
	ORE_RARITY,
	TILE_RANGES,
	ORE_RANGES,
};
