import spritesheet from "../../images/spritesheet.png";

// const images = {};

// images.playerSpritesheet = new Image();

// images.playerSpritesheet.onerror = function (err) {
// 	console.log(err);
// };
// images.playerSpritesheet.src = spritesheet;
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
	constructor(c, spritesheet, x, y, width, height, frame_limit) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.img = {};
		this.img.spritesheet = new Image();
		this.img.spritesheet.onerror = function (err) {
			console.log(err);
		};
		this.img.spritesheet.src = spritesheet;
		this.width = width; //sprite width
		this.height = height; //sprite height
		this.frame_limit = frame_limit;
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
