import spritesheet from "../../images/spritesheet.png";

const images = {};

images.playerSpritesheet = new Image();

images.playerSpritesheet.onerror = function (err) {
	console.log(err);
};
images.playerSpritesheet.src = spritesheet;
/*
	!spritesheet indexes
:	0 = right arrow
:	1 left arrow
:	2 right arrow
:	3 up arrow
:	4 down arrow
:	5 castle
:	6 trees
*/
export default class Sprite {
	constructor(c, x, y) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.width = 32.0; //sprite width
		this.height = 32.0; //sprite height
		this.frameX = 0;
		this.frameY = 0;
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	draw() {
		if (images.playerSpritesheet.complete) {
			this.c.beginPath();
			this.c.drawImage(
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

	changeFrameX(frameNumber) {
		this.frameX = frameNumber;
	}

	changeFrameY(frameNumber) {
		this.frameY = frameNumber;
	}

	update(x, y) {
		this.x = x;
		this.y = y;
		this.draw();
	}
}
