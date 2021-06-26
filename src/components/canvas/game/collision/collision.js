// import frames from "../frames/frames";

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

	check(corners) {
		let bool = true;
		let temp = [];
		for (let i = 0; i < corners.length; i++) {
			let c_x = corners[i].x;
			let c_y = corners[i].y;
			console.log("CORNERS", corners[i].x, corners[i].y);
			console.log(corners[i]);
			let tc = this.getTile(corners[i].column, corners[i].row, true);
			// console.log("i = %s", i, tc);
			console.log(tc.value);

			if (tc.value === 4) {
				bool = true;
			}

			if (tc.value === 0 || tc.value === 1) {
				bool = false;
			}
			temp.push(bool);
		}

		console.log(temp);
		// todo: fix clipping on tile edges
		return bool;
	}

	collide_top(corners, player_speed) {
		//checks adjacent tile bottom border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let new_y = corners[i].y - player_speed.y;
			let ad_tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(new_y / this.tilesize),
				true
			);

			if (
				new_y < ad_tile.y + this.tilesize &&
				corners[i].x > ad_tile.x &&
				corners[i].x < ad_tile.x + this.tilesize
			) {
				if (ad_tile.value !== 0) {
					bool = true;
				}
			}
		}
		return bool;
	}

	collide_down(corners, player_speed) {
		//checks adjecent tile top border
		let bool = false;

		for (let i = 0; i < corners.length; i++) {
			let new_y = corners[i].y + player_speed.y;
			let ad_tile = this.getTile(
				Math.floor(corners[i].x / this.tilesize),
				Math.floor(new_y / this.tilesize),
				true
			);
			if (ad_tile == undefined) return;
			if (new_y > ad_tile.y && corners[i].x > ad_tile.x && corners[i].x < ad_tile.x + this.tilesize) {
				if (ad_tile.value !== 0) {
					bool = true;
				}
			}
		}

		return bool;
	}

	collide_left(corners, player_speed) {
		//checks adjacent tile right border
		let bool = false;
		for (let i = 0; i < corners.length; i++) {
			let new_x = corners[i].x - player_speed.x;
			let ad_tile = this.getTile(
				Math.floor(new_x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			if (
				new_x < ad_tile.x + this.tilesize &&
				corners[i].y > ad_tile.y &&
				corners[i].y < ad_tile.y + this.tilesize
			) {
				if (ad_tile.value !== 0) {
					bool = true;
				}
			}
		}
		return bool;
	}

	collide_right(corners, player_speed) {
		//checks adjecent tile left border
		let bool = false;

		for (let i = 0; i < corners.length; i++) {
			let new_x = corners[i].x + player_speed.x;
			let ad_tile = this.getTile(
				Math.floor(new_x / this.tilesize),
				Math.floor(corners[i].y / this.tilesize),
				true
			);

			if (new_x > ad_tile.x && corners[i].y > ad_tile.y && corners[i].y < ad_tile.y + this.tilesize) {
				if (ad_tile.value !== 0) {
					bool = true;
				}
			}
		}

		return bool;
	}

	collideCheck(player_x, player_y, corners) {
		return this.check(corners);
	}
}
