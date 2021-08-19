const { frames } = require("../spritesheet.json");
const { generateLayers, addOresToTiles } = require("./generate_new");
function applyIntegrityPercents(map, columns, rows) {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			// after all tiles have been made
			// assign tile integrity percents
			const tile = map[y * columns + x];

			if (tile && tile.integrity !== 0)
				tile.integPercents = {
					0: 0,
					12.5: tile.integrity / 8,
					25: tile.integrity / 4,
					37.5: tile.integrity / 4 + tile.integrity / 8,
					50: tile.integrity / 2,
					62.5: tile.integrity / 2 + tile.integrity / 8,
					75: tile.integrity / 2 + tile.integrity / 4,
					87.5: tile.integrity / 2 + tile.integrity / 4 + tile.integrity / 8,
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

	let map = generateLayers(columns, rows, tilesize);
	addOresToTiles(map[1], columns, rows, width, height, tilesize);
	applyIntegrityPercents(map[1], columns, rows);

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
