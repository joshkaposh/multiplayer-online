export default class Rectangle {
	constructor(c, x, y, width, height, color) {
		this.c = c;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
	draw() {
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.fillRect(this.x, this.y, this.width, this.height);
	}
}
