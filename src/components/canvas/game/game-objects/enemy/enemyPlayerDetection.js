const collision = {
	rectRect: (r1, r2) => {
		if (
			r1.x + r1.width >= r2.x &&
			r1.x <= r2.x + r2.width &&
			r1.y + r1.height >= r2.y &&
			r1.y <= r2.y + r2.height
		) {
			return true;
		}
		return false;
	},
};

export default class PlayerDetection {
	constructor(c, x, y, width, height) {
		this.c = c;
		this.x = x - 60;
		this.y = y - 40;
		this.width = width * 3;
		this.height = height * 3;
	}

	detect(player) {
		const check = collision.rectRect(this, player);
		check === true ? (this.color = "lightred") : (this.color = "lightblue");
	}

	draw() {
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.fillRect(this.x, this.y, this.width, this.height);
	}

	update(player) {
		this.detect(player);
		this.draw();
	}
}
