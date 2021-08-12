import Sprite from "../../sprite/sprite";
export default class PlayerSprite extends Sprite {
	constructor(c, spritesheet, width, height, scale, frame_limit) {
		super(c, spritesheet, width, height, scale, frame_limit);
		this.c = c;
		this.actions = {
			idling: {
				limit: 5,
				right: { row: 0, startCol: 0 },
				left: { row: 1, startCol: 0 },
			},
			shopping: {
				limit: 1,
				right: { row: 0, startCol: 0 },
				left: { row: 0, startCol: 0 },
			},
			walking: {
				limit: 8,
				right: { row: 2, startCol: 0 },
				left: { row: 3, startCol: 0 },
			},

			falling: {
				limit: 2,
				right: { row: 4, startCol: 2 },
				left: { row: 5, startCol: 2 },
			},
			flying: {
				limit: 10,
				right: { row: 6, startCol: 0 },
				left: { row: 7, startCol: 0 },
			},
			mining: {
				limit: 3,
				right: { row: 8, startCol: 0 },
				left: { row: 9, startCol: 0 },
				downright: { row: 10, startCol: 0 },
				downleft: { row: 11, startCol: 0 },
			},
		};
	}

	startUpAnimation(animation) {
		if (animation.hasStartUpAnimation && !this.completeStartUpAnimation) {
			this.index = animation.startUpAnimation();
		}
	}

	changeFrame(status, { facing, down }) {
		let direction, animation;
		down === true ? (direction = `down${facing}`) : (direction = `${facing}`);
		animation = this.actions[status];
		if (animation[direction]) {
			this.index++;

			this.frameY = animation[direction].row;

			if (this.index >= animation.limit) {
				this.index = 0;
			}
		}
	}

	getStatus({ isMoving, isMining, isShopping, isGrounded, isFlying }) {
		let status;
		if (isMoving) {
			if (isFlying) {
				status = "flying";
			} else {
				status = "walking";
			}
		}

		if (isMining && !isMoving) {
			status = "mining";
		}
		if (isShopping) {
			status = "shopping";
		}
		if (!isGrounded && !isFlying && !isMoving) {
			status = "falling";
		}
		if (!isMining && !isMoving && isGrounded && !isFlying) {
			status = "idling";
		}

		return status;
	}

	updateFrames(state, facingDirection) {
		let status = this.getStatus(state);
		this.changeFrame(status, facingDirection);

		return status;
	}
}
