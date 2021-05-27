export default class MapEditor {
	constructor(c, camera, mouse, tilesize, world) {
		this.c = c;
		this.camera = camera;
		this.tilesize = tilesize;
		this.mouse = mouse;
		this.world = world;
		this.tiles = [];
		this.redos = [];
		this.redoIndex = -1;
		this.color = "brown";
		this.buttons = {
			undo: document.getElementById("undo"),
			redo: document.getElementById("redo"),
			clear: document.getElementById("clear"),
			// save: document.getElementById("save"),
		};
	}

	init() {
		this.addBtnListeners();
	}

	save(e) {
		// console.log("Saving");
		// e.preventDefault();
		// console.log("Editor Tiles::", this.tiles);
		// const rows = 20;
		// const columns = rows;
		// this.tiles.forEach((t) => {
		// 	for (let x = 0; x < columns; x++) {
		// 		for (let y = 0; y < rows; y++) {
		// 			// const tile = this.world.getTile(x, y);
		// 		}
		// 	}
		// });
		console.log(this.world.grid);
	}

	undo(e) {
		console.log("Undoing");
		e.preventDefault();
		if (this.tiles.length !== 0) {
			this.redoIndex += 1;
			this.redos.push(this.tiles.pop());
			console.log("Tiles:", this.tiles);
			console.log("Undo:: RedoTiles:", this.redos);
		}
	}

	redo(e) {
		console.log("Redoing");
		e.preventDefault();
		if (this.redoIndex <= -1) {
			return;
		}
		this.tiles.push(this.redos[this.redoIndex]);
		this.redos.pop();
		this.redoIndex -= 1;

		console.log("Redos:", this.redos);
	}

	clear(e) {
		console.log("Clearing");
		e.preventDefault();
		this.tiles.length = 0;
		this.redos.length = 0;
		this.redoIndex = -1;
		console.log(this.world.grid);
	}

	addBtnListeners() {
		Object.keys(this.buttons).forEach((key) => {
			this.buttons[key].addEventListener("click", this[key].bind(this));
		});
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
		this.c.fillStyle = this.color;
		this.c.fillRect(x, y, this.tilesize, this.tilesize);
	}

	draw() {
		let cameraX = this.camera.x;
		let cameraY = this.camera.y;

		for (let i = 0; i < this.tiles.length; i++) {
			let tile_x = this.tiles[i].x;
			let tile_y = this.tiles[i].y;

			if (
				tile_x >= cameraX &&
				tile_x <= cameraX + this.camera.width &&
				tile_y >= cameraY &&
				tile_y <= cameraY + this.camera.height
			) {
				this.drawTile(tile_x, tile_y);
			}
		}
	}

	update() {
		this.draw();
	}
}
