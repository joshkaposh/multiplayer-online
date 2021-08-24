import Sprite from "../../sprite/sprite";
export default class PlayerSprite extends Sprite {
	constructor(c, spritesheet, width, height, scale, frame_limit) {
		super(c, spritesheet, width, height, scale, frame_limit);
		this.c = c;
		this.actions = {
			idling: {
				repeat: true,
				start_loop: 0,
				end_loop: 5,
				right: { row: 0, startCol: 0 },
				left: { row: 1, startCol: 0 },
			},
			shopping: {
				repeat: true,
				start_loop: 0,
				end_loop: 1,
				right: { row: 0, startCol: 0 },
				left: { row: 0, startCol: 0 },
			},
			walking: {
				repeat: true,
				start_loop: 0,
				end_loop: 8,
				right: { row: 2, startCol: 0 },
				left: { row: 3, startCol: 0 },
			},

			falling: {
				repeat: true,
				start_loop: 1,
				end_loop: 4,
				right: { row: 4, startCol: 2 },
				left: { row: 5, startCol: 2 },
			},
			flying: {
				repeat: true,
				start_loop: 0,
				end_loop: 10,
				right: { row: 6, startCol: 0 },
				left: { row: 7, startCol: 0 },
			},
			mining: {
				repeat: true,
				start_loop: 0,
				end_loop: 3,
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

	changeFrame(state, { facing, down }) {
		let direction, animation;
		down === true ? (direction = `down${facing}`) : (direction = `${facing}`);
		animation = this.actions[state];
		if (animation[direction]) {
			this.index++;

			this.frameY = animation[direction].row;

			if (this.index >= animation.end_loop && animation.repeat) {
				this.index = animation.start_loop;
			}
		}
	}

	getState({ isMoving, isMining, isShopping, isGrounded, isFlying }) {
		let state;
		if (isMoving) {
			if (isFlying) state = "flying";
			else state = "walking";
		}
		if (isMining && !isMoving) {
			state = "mining";
		}
		if (!isGrounded && !isFlying && !isMoving) {
			state = "falling";
		}
		if (!isMining && !isMoving && isGrounded && !isFlying) {
			state = "idling";
		}
		if (isShopping) state = "shopping";

		return state;
	}

	updateFrames(state, facingDirection) {
		let currentState = this.getState(state);
		this.changeFrame(currentState, facingDirection);
		return currentState;
	}
}
