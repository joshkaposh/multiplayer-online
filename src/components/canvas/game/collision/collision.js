export default class PlayerCollision {
	constructor(speed, tilesize, columns, rows, worldW, worldH) {
		this.speed = speed;
		this.width = tilesize;
		this.height = tilesize;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.worldW = worldW;
		this.worldH = worldH;
	}

	init(grid) {
		this.grid = grid;
	}

	getTile(x, y, bool) {
		if (bool) return this.grid[y * this.columns + x];
		let x0 = Math.trunc(x / 64);
		let y0 = Math.trunc(y / 64);
		return this.grid[y0 * this.columns + x0];
	}

	collide_top(corners) {
		//checks adjacent tile bottom border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			if (
				corners[i].y < tile.y + this.tilesize &&
				corners[i].x > tile.x &&
				corners[i].x < tile.x + this.tilesize
			) {
				if (tile.value !== 0) {
					bool = true;
				}
			}
		}
		return bool;
	}

	collide_down(corners) {
		//checks adjecent tile top border
		let bool = false;

		// console.log(corners);

		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			// console.log(tile);

			if (corners[i].y > tile.y && corners[i].x > tile.x && corners[i].x < tile.x + this.tilesize) {
				if (tile.value !== 0) {
					bool = true;
				}
			}
		}

		return bool;
	}

	collide_left(corners) {
		//checks adjacent tile right border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			if (
				corners[i].x < tile.x + this.tilesize &&
				corners[i].y > tile.y &&
				corners[i].y < tile.y + this.tilesize
			) {
				if (tile.value !== 0) {
					bool = true;
				}
			}
		}
		return bool;
	}

	collide_right(corners) {
		//checks adjacent tile left border
		let bool = false;

		for (let i = 0; i < corners.length; i++) {
			let tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			if (corners[i].x > tile.x && corners[i].y > tile.y && corners[i].y < tile.y + this.tilesize) {
				if (tile.value !== 0) {
					bool = true;
				}
			}
		}

		return bool;
	}
}
