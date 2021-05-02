export default class Ball {
	constructor(c, x, y, radius, color) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.vx = 5;
		this.vy = 0;

		this.radius = radius;
		this.color = color;
		this.bounds = {
			x: 600,
			y: 400,
		};
	}
	draw() {
		this.c.beginPath();
		this.c.fillStyle = "red";
		this.c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, false);
		this.c.stroke();
	}

	update(paddles) {
		paddles.forEach((paddle) => {
			if (
				this.x - this.radius <= paddle.x + paddle.width &&
				this.x - this.radius >= paddle.x + paddle.width &&
				this.y - this.radius <= paddle.y + paddle.height &&
				this.y - this.radius >= paddle.y + paddle.height
			) {
				this.vx = -this.vx;
			}
		});

		if (this.x + this.radius > this.bounds.x || this.x - this.radius < 0) {
			this.vx = -this.vx;
		}

		if (this.y + this.radius > this.bounds.y || this.y - this.radius < 0) {
			this.vy = -this.vy;
		}

		this.x += this.vx;
		this.y += this.vy;

		this.draw();
	}
}
