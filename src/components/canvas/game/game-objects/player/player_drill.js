import Sprite from "../../sprite/sprite";
export default class DrillSprite extends Sprite {
	constructor(c, spritesheet, width, height, frame_limit) {
		super(c, spritesheet, width, height, frame_limit);
		this.c = c;
		this.direction = null;
		this.frame_limit = 4;
		this.frameYs = {
			left: 2,
			right: 1,
			downright: 4,
			downleft: 3,
		};
		this.frame_loops = {
			left: [0, 1, 0, 1],
			right: [0, 1, 0, 1],
			downleft: [0, 1, 0, 1],
			downright: [0, 1, 0, 1],
		};
	}
}
