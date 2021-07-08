// TODO: refactor to handle direction movements & actions;
export default class Sprite {
	constructor(c, spritesheet, width, height, frame_limit) {
		this.c = c;
		this.img = {};
		this.img.spritesheet = new Image();
		this.img.spritesheet.onerror = function (err) {
			console.log(err);
		};
		this.img.spritesheet.src = spritesheet;
		this.width = width; //sprite width
		this.height = height; //sprite height
		this.frame_limit = frame_limit;
		this.index = 0;
		this.frameX = 0;
		this.frameY = 0;
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	draw(x, y) {
		if (this.img.spritesheet.complete) {
			this.c.beginPath();
			this.c.drawImage(
				this.img.spritesheet,
				this.width * this.frameX,
				this.height * this.frameY,
				this.width,
				this.height,
				x,
				y,
				this.width,
				this.height
			);
		}
	}

	update(x, y) {
		this.x = x;
		this.y = y;
		this.draw();
	}
}
