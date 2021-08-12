const { frames } = require("../spritesheet.json");
const { generateTiles, generateOres } = require("./generate");

function applyIntegrityPercents(map, columns, rows) {
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
}

function applyToxicity(map, ranges) {
	//todo: add levels to map (1: 0~300,
	//todo: 				2: 300~600, etc)
}

function initializeMap() {
	let rows = 100;
	let columns = 20;
	let tilesize = 64;
	let width = columns * tilesize;
	let height = rows * tilesize;

	let map = generateTiles(columns, rows, tilesize, width, height);
	generateOres(map, columns, rows, width, height, tilesize);

	applyIntegrityPercents(map, columns, rows);

	return {
		data: map,
		rows: rows,
		columns: columns,
		tilesize: tilesize,
		mapW: width,
		mapH: height,
		frames,
	};
}

module.exports = initializeMap();
