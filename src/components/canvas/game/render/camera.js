export default class Camera {
	constructor(c, pos, width, height, tilesize, columns, rows, worldW, worldH) {
		this.c = c;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		this.worldW = worldW;
		this.worldH = worldH;
		this.columns = columns;
		this.rows = rows;
		this.scrollSpeed = tilesize;
		this.xMin = 0;
		this.yMin = 0;
		this.xMax = this.columns;
		this.yMax = this.rows;
	}

	getDimensions() {
		return {
			xMin: Math.floor(this.pos.x / this.tilesize),
			xMax: Math.ceil(this.pos.x / this.tilesize + this.width / this.tilesize),
			yMin: Math.floor(this.pos.y / this.tilesize),
			yMax: Math.ceil(this.pos.y / this.tilesize + this.height / this.tilesize),
		};
	}

	follow(player) {
		this.pos.x = Math.round(player.pos.x - this.width / 2 + player.width / 2);
		this.pos.y = Math.round(player.pos.y - this.height / 2 + player.height / 2);

		let { xMin, yMin, xMax, yMax } = this.getDimensions();

		if (yMin < this.yMin) this.pos.y = this.yMin;
		if (xMin < this.xMin) this.pos.x = this.xMin;
		if (xMax > this.xMax) this.pos.x = this.columns * this.tilesize - this.width;
		if (yMax > this.yMax) this.pos.y = this.rows * this.tilesize - this.height;
	}

	update(player) {
		this.follow(player);
	}
}
