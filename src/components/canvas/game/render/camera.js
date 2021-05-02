export default class Camera {
	constructor(c, x, y, width, height) {
		this.tilesize = 64;
		this.c = c;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.minX = 0;
		this.minY = 0;
	}

	center() {}

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
			return true;
		}
		return false;
	}

	getDimensions() {
		return {
			xMin: Math.trunc(this.x / 64),
			yMin: Math.trunc(this.y / 64),
			xMax: Math.trunc(Math.floor(this.x + this.width) / 64),
			yMax: Math.trunc(Math.floor(this.y + this.height) / 64),
		};
	}

	follow(player) {
		console.log("camera following player");
		// if (player.x + player.width > this.x + this.width) {
		// 	this.x += 64;
		// }
		// this.x = player.x - this.width * 0.5;
		// this.y = player.y - this.height * 0.5;
		// this.x = this.width * 0.5;
		// this.y = this.height * 0.5;
	}
}
