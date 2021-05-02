import PlayerDetection from "./enemyPlayerDetection";

export default class Enemy {
	constructor(c, x, y, width, height, speed, color) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.color = color;
		this.eyesight = new PlayerDetection(
			this.c,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}

	draw() {
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.fillRect(this.x, this.y, this.width, this.height);
	}

	update(player) {
		this.eyesight.update(player);
		this.draw();
	}
}
