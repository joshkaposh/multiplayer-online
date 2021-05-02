export default class Grid {
	constructor(turnmanager, c, width, height) {
		this.manager = turnmanager;
		this.c = c;
		this.numOfLines = 10;
		this.width = width;
		this.height = height;
		this.cellWidth = this.width / this.numOfLines;
		this.cellHeight = this.height / this.numOfLines;
		this.lines = [];
		this.color = "#000000";
	}

	init() {
		if (this.lines.length !== 0) this.lines.length = 0;
		// index 0
		this.lines.push({ x: 0, y: 0 });

		for (let i = 1; i <= this.numOfLines; i++) {
			this.lines.push({
				x: i * this.cellWidth,
				y: i * this.cellHeight,
			});
		}
	}

	drawLines() {
		this.c.beginPath();
		for (let i = 0; i < this.lines.length; i++) {
			this.c.moveTo(this.lines[i].x, 0);
			this.c.lineTo(this.lines[i].x, this.height);
			this.c.stroke();

			this.c.moveTo(0, this.lines[i].y);
			this.c.lineTo(this.width, this.lines[i].y);
			this.c.stroke();
		}
	}

	render() {
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		this.drawLines();
	}
}
