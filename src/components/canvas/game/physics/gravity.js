export default class Gravity {
	constructor(initial, velocity, acc, drag) {
		this.initial = initial;
		this.velocity = velocity;
		this.acc = acc;
		this.drag = drag;
		// this.MAX_VELOCITY = 0.185;
		// this.MAX_VELOCITY = 17.5;
	}

	increment() {
		// increment gravity velocity
		const ACC = this.acc * this.drag;
		this.velocity += ACC;
	}

	reset() {
		this.velocity = this.initial;
	}
}
