const Map = require("./tile-map..json");

const frames = {
	walkables: {
		sky: {
			col: 0,
			row: 0,
		},
		mined_ground: {
			col: 1,
			row: 0,
		},
	},
	surface: {
		center: {
			col: 0,
			row: 1,
		},
		left: {
			col: 1,
			row: 1,
		},
		right: {
			col: 2,
			row: 1,
		},
	},
	edges: {
		center: {
			col: 0,
			row: 2,
		},
		left: {
			col: 1,
			row: 2,
		},
		right: {
			col: 2,
			row: 2,
		},
		up: {
			col: 3,
			row: 2,
		},
		down: {
			col: 4,
			row: 2,
		},
	},
	corners: {
		top_left: {
			col: 0,
			row: 3,
		},
		top_right: {
			col: 1,
			row: 3,
		},
		bottom_right: {
			col: 2,
			row: 3,
		},
		bottom_left: {
			col: 3,
			row: 3,
		},
	},
};

function init() {
	let map = [];

	let rows = 100;
	let columns = 20;
	let tilesize = 64;
	let width = columns * tilesize;
	let height = rows * tilesize;
	let frame = 0;
	let value, integrity;

	function getTile(col, row) {
		// return Map.layers[0].data[row * Map.width + col];
		return map[row * width + col];
	}

	// todo: make ores

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// set default tile values
			value = 5;
			integrity = 3;
			frame = frames.edges.center; //dirt
			if (y <= 2) {
				//sky
				frame = frames.walkables.sky;
				integrity = 0;
				value = 0;
			}
			if (y === 3) {
				//grass
				value = 4;
				frame = frames.surface.center;
			}

			map.push({
				x: x * tilesize,
				y: y * tilesize,
				frameX: frame.col,
				frameY: frame.row,
				column: x,
				row: y,
				value: value,
				integrity: integrity,
			});
		}
	}

	return {
		data: map,
		getTile: getTile,
		rows: rows,
		columns: columns,
		tilesize: tilesize,
		mapW: width,
		mapH: height,
		frames: frames,
	};
}

module.exports = init();
