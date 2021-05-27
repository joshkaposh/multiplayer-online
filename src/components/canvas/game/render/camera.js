export default class Camera {
	constructor(c, tilesize, x, y, width, height, worldW, worldH) {
		this.c = c;
		this.tilesize = tilesize;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.worldW = worldW;
		this.worldH = worldH;
		this.minX = 0;
		this.minY = 0;
	}

	panUp() {
		this.y -= this.tilesize;
	}
	panDown() {
		this.y += this.tilesize;
	}
	panLeft() {
		this.x -= this.tilesize;
	}
	panRight() {
		this.x += this.tilesize;
	}

	offsetToMiddle(
		targetX,
		targetY,
		cameraX,
		cameraY,
		cameraW,
		cameraH,
		canvasW,
		canvasH
	) {
		if (targetY === null)
			return targetX - cameraX + canvasW / 2 - cameraW / 2;
		if (targetX === null)
			return targetY - cameraY + canvasH / 2 - cameraH / 2;
	}

	scrollTo(x, y) {
		this.x = x;
		this.y = y;
	}

	isWithinView(x, y) {
		let { xMin, xMax, yMin, yMax } = this.getDimensions();

		if (x < xMin || x > xMax || y < yMin || y > yMax) {
			// tile is out of camera view
			return false;
		}
		return true;
	}

	getDimensions() {
		return {
			xMin: Math.trunc(this.x / 64),
			yMin: Math.trunc(this.y / 64),
			xMax: Math.trunc(Math.floor(this.x + this.width) / 64),
			yMax: Math.trunc(Math.floor(this.y + this.height) / 64),
		};
	}

	follow(player) {}

	draw() {
		let cameraX = this.c.canvas.width / 2 - this.width / 2;
		let cameraY = this.c.canvas.height / 2 - this.height / 2;

		this.c.rect(cameraX, cameraY, this.width, this.height);
		this.c.stroke();
	}
}
