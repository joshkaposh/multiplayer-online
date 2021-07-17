const { frames } = require("./spritesheet.json");
// const ores = {
// 	coppper: {
// 		label: "copper_ore",
// 		default: {
// 			col: 0,
// 			row: 3,
// 		},
// 		breaking: {
// 			0: { col: 0, row: 13 },
// 			1: { col: 1, row: 13 },
// 			2: { col: 2, row: 13 },
// 			3: { col: 3, row: 13 },
// 		},
// 	},
// 	iron: {
// 		label: "iron_ore",
// 		default: {
// 			col: 1,
// 			row: 3,
// 		},
// 		breaking: {
// 			0: { col: 0, row: 14 },
// 			1: { col: 1, row: 14 },
// 			2: { col: 2, row: 14 },
// 			3: { col: 3, row: 14 },
// 		},
// 	},
// };

// const frames = {
// 	walkables: {
// 		sky: {
// 			col: 0,
// 			row: 0,
// 		},
// 		mined_ground: {
// 			col: 1,
// 			row: 0,
// 		},
// 	},
// 	grass: {
// 		default: {
// 			col: 0,
// 			row: 1,
// 		},
// 		corner_right: {
// 			col: 1,
// 			row: 1,
// 		},
// 		corner_left: {
// 			col: 2,
// 			row: 1,
// 		},
// 		corner_both: {
// 			col: 3,
// 			row: 1,
// 		},
// 		breaking: {
// 			default: {
// 				0: { col: 0, row: 7 },
// 				1: { col: 1, row: 7 },
// 				2: { col: 2, row: 7 },
// 				3: { col: 3, row: 7 },
// 			},
// 			corner_right: {
// 				0: { col: 0, row: 8 },
// 				1: { col: 1, row: 8 },
// 				2: { col: 2, row: 8 },
// 				3: { col: 3, row: 8 },
// 			},
// 			corner_left: {
// 				0: { col: 0, row: 9 },
// 				1: { col: 1, row: 9 },
// 				2: { col: 2, row: 9 },
// 				3: { col: 3, row: 9 },
// 			},
// 			corner_both: {
// 				0: { col: 0, row: 10 },
// 				1: { col: 1, row: 10 },
// 				2: { col: 2, row: 10 },
// 				3: { col: 3, row: 10 },
// 			},
// 		},
// 	},
// 	dirt: {
// 		default: {
// 			col: 0,
// 			row: 2,
// 		},
// 		edges: {
// 			right: {
// 				col: 0,
// 				row: 4,
// 			},
// 			left: {
// 				col: 1,
// 				row: 4,
// 			},
// 			top: {
// 				col: 2,
// 				row: 4,
// 			},
// 			bottom: {
// 				col: 3,
// 				row: 4,
// 			},
// 		},
// 		corners: {
// 			top_right: { col: 0, row: 5 },
// 			top_left: { col: 1, row: 5 },
// 			bottom_right: { col: 2, row: 5 },
// 			bottom_left: { col: 3, row: 5 },
// 			both_left: { col: 0, row: 6 },
// 			both_right: { col: 1, row: 6 },
// 			both_top: { col: 2, row: 6 },
// 			both_bottom: { col: 3, row: 6 },
// 		},
// 	},
// 	hardened_dirt: {
// 		default: {
// 			col: 1,
// 			row: 2,
// 		},
// 		topsoil: {
// 			col: 2,
// 			row: 2,
// 		},
// 		edges: {
// 			right: { col: 4, row: 4 },
// 			left: { col: 5, row: 4 },
// 			top: { col: 6, row: 4 },
// 			bottom: { col: 7, row: 4 },
// 		},
// 		corners: {
// 			top_right: { col: 4, row: 5 },
// 			top_left: { col: 5, row: 5 },
// 			bottom_right: { col: 6, row: 5 },
// 			bottom_left: { col: 7, row: 5 },
// 			both_left: { col: 4, row: 6 },
// 			both_right: { col: 5, row: 6 },
// 			both_top: { col: 6, row: 6 },
// 			both_bottom: { col: 7, row: 6 },
// 		},
// 		breaking: {
// 			0: { col: 0, row: 12 },
// 			1: { col: 1, row: 12 },
// 			2: { col: 2, row: 12 },
// 			3: { col: 3, row: 12 },
// 		},
// 	},
// 	ores,
// };

function generateOres(map, cols, rows, mapW, mapH, tilesize) {
	for (let y = 5; y < rows; y += 3) {
		for (let x = 0; x < cols; x += 5) {
			let oreDumpArray = [];

			if (y >= rows / 4) {
				// do nothing
				break;
			}
			let dir = randomIntFromRange(1, 7);
			let center, top, left, right, down;

			center = map[y * cols + x];

			switch (dir) {
				case 1:
					left = map[y * cols + (x - 1)];
					top = map[(y - 1) * cols + x];
					oreDumpArray.push(center, left, top);
					// left
					break;
				case 2:
					left = map[y * cols + (x - 1)];
					down = map[(y + 1) * cols + x];
					oreDumpArray.push(center, left, down);
					// up
					break;
				case 3:
					top = map[(y - 1) * cols + x];
					right = map[y * cols + (x + 1)];
					oreDumpArray.push(center, right, top);
					// right
					break;
				case 4:
					down = map[(y + 1) * cols + x];
					right = map[y * cols + (x + 1)];
					oreDumpArray.push(center, down, right);
					// down
					break;
				case 5:
					top = map[(y - 1) * cols + x];
					down = map[(y + 1) * cols + x];
					oreDumpArray.push(center, top, down);
					break;
				case 6:
					left = map[y * cols + (x - 1)];
					right = map[y * cols + (x + 1)];
					oreDumpArray.push(center, left, right);
					break;
				default:
					break;
			}
			oreDumpArray.forEach((tile) => {
				if (tile.type !== "grass") {
					tile.type = "copper_ore";
					tile.frameX = frames.ores.copper.default.col;
					tile.frameY = frames.ores.copper.default.row;
					tile.integrity = 150;
				}
			});
		}
	}
}

const randomIntFromRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

function init() {
	let map = [];
	let rows = 100;
	let columns = 20;
	let tilesize = 64;
	let width = columns * tilesize;
	let height = rows * tilesize;
	let frame = 0;
	let value, integrity, type;

	// todo: make ores

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// set default tile values
			value = 5;
			integrity = 100;

			if (y <= 3) {
				//sky
				frame = frames.walkables.sky;
				integrity = 0;
				value = 0;
				type = "sky";
			}
			if (y === 4) {
				//grass
				frame = frames.grass.default;
				value = 4;
				type = "grass";
			}

			if (y > 4 && y < rows / 4) {
				type = "dirt";
				frame = frames.dirt.default;
			}

			if (y === rows / 4) {
				integrity = 200;
				type = "hardened_dirt_topsoil";
				frame = frames.hardened_dirt.topsoil;
			}
			if (y > rows / 4) {
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
	generateOres(map, columns, rows, width, height, tilesize);

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// after all tiles have been made
			// assign tile integrity percents
			const tile = map[y * columns + x];

			if (tile.integrity !== 0)
				tile.integPercents = {
					0: 0,
					25: tile.integrity / 4,
					50: tile.integrity / 2,
					75: tile.integrity / 4 + tile.integrity / 2,
					100: tile.integrity,
				};
		}
	}
	return {
		data: map,
		rows: rows,
		columns: columns,
		tilesize: tilesize,
		mapW: width,
		mapH: height,
		frames: frames,
	};
}

module.exports = init();
