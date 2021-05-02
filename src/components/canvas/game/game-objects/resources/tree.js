import spritesheet from "../../../images/spritesheet.png";

const images = {};

images.tree = new Image();

images.tree.onerror = function (err) {
	console.error(err);
};
images.tree.src = spritesheet;

export default class Tree {
	constructor(c, x, y) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.width = 32.0; //sprite width
		this.height = 32.0; //sprite height
		this.frameX = 6;
		this.frameY = 0;
	}
	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.beginPath();
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	draw() {
		if (images.tree.complete) {
			this.drawSprite(
				images.playerSpritesheet,
				this.width * this.frameX,
				this.height * this.frameY,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
		}
	}
}
