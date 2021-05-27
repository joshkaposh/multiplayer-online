const Map = require("./tile-map..json");

function getTile(col, row) {
	return Map.layers[0].data[row * Map.width + col];
}

function init() {
	let map = [];
	let rows = Map.height;
	let columns = Map.width;
	let tilesize = Map.tilewidth;

	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			const tile = getTile(x, y);
			map.push({
				x: x * tilesize,
				y: y * tilesize,
				value: tile,
			});
		}
	}

	return {
		data: map,
		getTile: getTile,
		rows: Map.height,
		columns: Map.width,
		tilesize: Map.tilewidth,
		mapW: Map.width * Map.tilewidth,
		mapH: Map.height * Map.tileheight,
	};
}

module.exports = init();
