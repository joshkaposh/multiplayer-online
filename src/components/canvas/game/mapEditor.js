export default class MapEditor {
	constructor(c, camera, mouse, tilesize) {
		this.c = c;
		this.camera = camera;
		this.tilesize = tilesize;
		this.mouse = mouse;

		this.tiles = [];
	}

	updateSelection(text) {
		const tag = document.getElementById("editor-selected-value");
		tag.innerHTML = text;
	}

	snapToGrid(x, y, tilesize) {
		return {
			x: Math.round(x / tilesize) * tilesize,
			y: Math.round(y / tilesize) * tilesize,
		};
	}

	drawTile(x, y) {
		this.c.beginPath();
		this.c.fillStyle = "brown";
		this.c.fillRect(x, y, this.tilesize, this.tilesize);
	}

	drawMouse() {
		let x = this.mouse.x;
		let y = this.mouse.y;

		const cameraX =
			(this.camera.x + this.c.canvas.width) / 2 - this.camera.width / 2;
		const cameraY =
			(this.camera.y + this.c.canvas.height) / 2 - this.camera.height / 2;

		// ? tile.x - this.camera.x + middleX - this.camera.width / 2;
		//? (this.camera.x + this.c.canvas.width) / 2 - this.camera.width / 2;

		if (
			x < cameraX ||
			x > cameraX + this.camera.width ||
			y < cameraY ||
			y > cameraY + this.camera.height
		) {
		} else {
			//! section 2 - new x,y based on mouse.selection
			this.c.fillStyle = "brown";
			this.c.beginPath();
			// this.c.fillRect(
			// 	this.mouse.selection.x,
			// 	this.mouse.selection.y,
			// 	this.tilesize,
			// 	this.tilesize
			// );
		}
	}

	draw() {
		this.c.beginPath();
		for (let i = 0; i < this.tiles.length; i++) {
			let tile_x = this.tiles[i].x;
			let tile_y = this.tiles[i].y;
			this.drawTile(tile_x * this.tilesize, tile_y * this.tilesize);
		}
	}

	update() {
		// this.draw();
		this.drawMouse();
	}
}
