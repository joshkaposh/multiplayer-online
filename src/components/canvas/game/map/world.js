import MapEditor from "../mapEditor";

export function GridInfo() {
	// ? player.x - camera.x + (canvas.width / 2) - (camera.width / 2)

	return {
		tilesize: 64,
		columns: 20,
		rows: 20,
		camera: { h: 64 * 5, w: 64 * 5 },
		offsetToMiddle: (
			targetX,
			targetY,
			cameraX,
			cameraY,
			cameraW,
			cameraH,
			canvasW,
			canvasH
		) => {
			if (targetY == null)
				return targetX - cameraX + canvasW / 2 - cameraW / 2;
			if (targetX == null)
				return targetY - cameraY + canvasH / 2 - cameraH / 2;
		},
	};
}

export default class World {
	constructor(c, camera, tilesize, columns, rows) {
		this.c = c;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.camera = camera;
		this.mouse = {
			x: null,
			y: null,
			selection: { x: null, y: null },
		};
		this.map_editor = new MapEditor(
			this.c,
			this.camera,
			this.mouse,
			this.tilesize
		);
		this.cellWidth = this.tilesize;
		this.cellHeight = this.tilesize;
		this.width = this.columns * this.tilesize;
		this.height = this.rows * this.tilesize;
		this.grid = [];

		this.color = "#000000";
	}

	init() {
		if (this.grid.length !== 0) this.grid.length = 0;
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				this.grid.push({
					x: x * this.tilesize,
					y: y * this.tilesize,
					column: x,
					row: y,
					tileType: "cell",
				});
			}
		}
		this.c.canvas.addEventListener("mousemove", (e) => {
			let mouseX = e.offsetX;
			let mouseY = e.offsetY;
			// this.mouse.x = mouseX - this.tilesize / 2;
			// this.mouse.y = mouseY - this.tilesize / 2;
			this.mouse.x = mouseX;
			this.mouse.y = mouseY;
		});

		this.c.canvas.addEventListener("click", (e) => {
			let x = e.offsetX;
			let y = e.offsetY;
			console.log(this.mouse);

			const cameraX =
				(this.camera.x + this.c.canvas.width) / 2 -
				this.camera.width / 2;
			const cameraY =
				(this.camera.y + this.c.canvas.height) / 2 -
				this.camera.height / 2;

			if (
				x > cameraX &&
				x < cameraX + this.camera.width &&
				y > cameraY &&
				y < this.camera.height
			) {
				this.map_editor.tiles.push({
					x: this.mouse.selection.x,
					y: this.mouse.selection.y,
				});
			}
			console.log(this.map_editor.tiles);
		});

		this.logger();
	}

	getTile(col, row) {
		return this.grid[row * this.columns + col];
	}

	logger() {
		const dim = this.camera.getDimensions();
		console.log(dim);
		console.log(this.grid);
	}

	snapToGrid(x, y, tilesize) {
		return {
			x: Math.round(x / tilesize) * tilesize,
			y: Math.round(y / tilesize) * tilesize,
		};
	}

	render(player) {
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		this.c.beginPath();
		// this.map_editor.update();

		const middleX = this.c.canvas.width / 2;
		const middleY = this.c.canvas.height / 2;

		const cameraX =
			(this.camera.x + this.c.canvas.width) / 2 - this.camera.width / 2;
		const cameraY =
			(this.camera.y + this.c.canvas.height) / 2 - this.camera.height / 2;

		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();

		if (yMin < 0) yMin = 0;
		if (xMin < 0) xMin = 0;

		// draw grid within camera dimensions
		for (let x = xMin; x < xMax; x++) {
			for (let y = yMin; y < yMax; y++) {
				const tile = this.getTile(x, y);
				let tile_x =
					tile.x - this.camera.x + middleX - this.camera.width / 2;
				let tile_y =
					tile.y - this.camera.x + middleY - this.camera.height / 2;

				if (
					this.map_editor.mouse.x > tile_x &&
					this.map_editor.mouse.x < tile_x + this.tilesize &&
					this.map_editor.mouse.y > tile_y &&
					this.map_editor.mouse.y < tile_y + this.tilesize
				) {
					this.c.fillStyle = "pink";
					this.c.fillRect(
						tile_x,
						tile_y,
						this.tilesize,
						this.tilesize
					);

					this.map_editor.mouse.selection = {
						x: tile_x,
						y: tile_y,
					};
				}
				this.c.rect(tile_x, tile_y, this.tilesize, this.tilesize);
				this.c.stroke();
			}
		}

		for (let i = 0; i < this.map_editor.tiles.length; i++) {
			let tile_x = this.map_editor.tiles[i].x;
			let tile_y = this.map_editor.tiles[i].y;
			if (
				this.map_editor.mouse.x > cameraX &&
				this.map_editor.mouse.x < cameraX + this.camera.width &&
				this.map_editor.mouse.y > cameraY &&
				this.map_editor.mouse.y < cameraY + this.camera.height
			) {
				this.map_editor.drawTile(tile_x, tile_y);
			}
		}

		this.map_editor.update();

		// todo: refactor how the world, player, camera classes are called
		// todo: adjust player movement to camera centering (see calculation below)
		// ? player.x - camera.x + (canvas.width / 2) - (camera.width / 2)
		// ? player.y - camera.y + (canvas.height / 2) - (camera.height / 2)

		this.c.rect(cameraX, cameraY, this.camera.width, this.camera.height);
		this.c.stroke();

		// this.camera.follow(this.player);
	}
}
