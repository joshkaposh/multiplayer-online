export default class Animation {
	constructor(frameX, frameY, xMax, yMax) {
		this.xMax = xMax;
		this.yMax = yMax;
		this.directions = {
			right: { frames: 8, frameY: 0 },
			left: { frames: 8, frameY: 1 },
			down: {
				down_right: { frameY: 4 },
				down_left: { frameY: 5 },
				slow: { frames: 1, frameX: 0 },
				fast: { frames: 1, frameX: 1 },
				landing: {
					frames: 1,
					slow: { frameX: 3 },
					fast: { frameX: 2 },
				},
			},
		};
		this.frameX = frameX;
		this.frameY = frameY;
	}
	left() {
		this.frameY = this.directions["left"].frameY;
		if (this.frameX > this.directions["left"].frames) {
			this.frameX = 0;
		} else {
			this.frameX++;
		}
	}

	right() {
		this.frameY = this.directions["right"].frameY;
		if (this.frameX > this.directions["right"].frames) {
			this.frameX = 0;
		} else {
			this.frameX++;
		}
	}
	down(direction, velocity) {
		let dir;
		direction === "left" ? (dir = "left") : (dir = "right");
	}
}
