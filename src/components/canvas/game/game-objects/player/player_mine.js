import frames from "../../frames/frames";

//frames row 4 === mining

function isTileEdge(tile) {
	if (tile.value === 2) return true;
	return false;
}

function isTileCorner(tile) {
	if (tile.value === 3) return true;
	return false;
}

class Drill {
	constructor(c) {
		this.c = c;
		this.direction = null;
		this.frameX = 0;
		this.frameY = 0;
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}
	draw(x, y) {}
}

export default class Mine {
	constructor(c, collision, speed, tilesize, columns, rows, mapW, mapH) {
		this.collision = collision;
		this.speed = speed;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.mapW = mapW;
		this.mapH = mapH;
		this.count = 0;
		this.drill = new Drill(c);
	}

	getSurroundingTiles(tile) {
		let tile_right = this.collision.getTile(tile.column + 1, tile.row, true);
		let tile_left = this.collision.getTile(tile.column - 1, tile.row, true);
		let tile_under = this.collision.getTile(tile.column, tile.row + 1, true);
		let tile_above = this.collision.getTile(tile.column, tile.row - 1, true);
		let tile_above_right = this.collision.getTile(tile.column + 1, tile.row - 1, true);
		let tile_under_right = this.collision.getTile(tile.column + 1, tile.row + 1, true);
		return { current: tile, tile_left, tile_right, tile_under, tile_above, tile_above_right, tile_under_right };
	}

	get score() {
		return this.count;
	}

	checkSurroundingTileValue(surroundings) {
		if (surroundings.tile_right.value === 4) {
			surroundings.tile_right.frameX = 2;
			surroundings.tile_right.frameY = 1;
			surroundings.tile_right.value = 1;
		}

		if (surroundings.tile_right.value === 5) {
			surroundings.tile_right.frameX = 2;
			surroundings.tile_right.frameY = 2;
			surroundings.tile_right.value = 2;
		}

		if (surroundings.tile_left.value === 4) {
			surroundings.tile_left.frameX = 1;
			surroundings.tile_left.frameY = 1;
			surroundings.tile_left.value = 1;
		}

		if (surroundings.tile_left.value === 5) {
			surroundings.tile_left.frameX = 1;
			surroundings.tile_left.frameY = 2;
			surroundings.tile_left.value = 2;
		}

		if (surroundings.tile_above.value === 2) {
			surroundings.tile_above.frameX = 3;
			surroundings.tile_above.frameY = 3;
			surroundings.tile_above.value = 3;
		}
		// if (surroundings.tile_above.value === 2.5) {
		// 	surroundings.tile_above.frameX = 2;
		// 	surroundings.tile_above.frameY = 3;
		// 	surroundings.tile_above.value = 3;
		// }
	}

	mine(tile, direction) {
		let integrity = tile.integrity;
		// let full = 3;
		// let half = 1.5;
		// let quarter = 0.75;

		console.log(tile);

		if (tile.value === frames.walkables[0] || tile.value === frames.walkables[1] || tile.integrity === 0) {
			return;
		}
		if (tile.frameY === 1) tile.frameY = 4;
		//grass
		if (tile.frameY === 2) tile.frameY = 5;
		//dirt
		console.log(integrity);

		switch (direction) {
			case "left":
				break;
			case "right":
				break;

			default:
				break;
		}

		switch (integrity) {
			case 3:
				tile.frameX = 0;
				break;

			case 2.25:
				tile.frameX = 1;
				break;

			case 1.5:
				tile.frameX = 2;
				break;

			case 0.75:
				tile.frameX = 3;
				break;
			default:
				break;
		}

		// mined
		if (integrity - 0.25 === 0) {
			tile.integrity -= 0.25;
			tile.value = 0;
			tile.frameX = 1;
			tile.frameY = 0;
			console.log(this.getSurroundingTiles(tile));
			this.checkSurroundingTileValue(this.getSurroundingTiles(tile));

			this.count++;
			return;
		}

		tile.integrity -= 0.25;
	}
}
