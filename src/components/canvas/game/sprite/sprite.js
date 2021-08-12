// TODO: refactor to handle direction movements & actions;
export default class Sprite {
	constructor(c, spritesheet, width, height, scale, frame_limit) {
		this.c = c;
		this.img = {};
		this.img.spritesheet = new Image();
		this.img.spritesheet.onerror = function (err) {
			console.log(err);
		};
		this.img.spritesheet.src = spritesheet;
		this.width = width; //sprite width
		this.height = height; //sprite height
		this.scale = scale; //game scale
		this.frame_limit = frame_limit;
		this.index = 0;
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
				this.width * this.index,
				this.height * this.frameY,
				this.width,
				this.height,
				x,
				y,
				this.width * this.scale,
				this.height * this.scale
			);
		}
	}

	update(x, y) {
		this.x = x;
		this.y = y;
		this.draw();
	}
}
