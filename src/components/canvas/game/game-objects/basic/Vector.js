export default class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	subX(vector) {
		this.x -= vector.x;
	}
	subY(vector) {
		this.y -= vector.y;
	}

	addX(vector) {
		this.x += vector.x;
	}
	addY(vector) {
		this.y += vector.y;
	}

	add(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
}
