import MapEditor from "../mapEditor";
import spritesheet from "../../images/ground.png";

const images = {};

images.ground_spritesheet = new Image();

images.ground_spritesheet.onerror = function (err) {
	console.error(err);
};
images.ground_spritesheet.src = spritesheet;

export default class World {
	constructor(
		c,
		camera,
		{ tilesize, rows, columns, data, mapW, mapH },
		player
	) {
		this.c = c;
		this.camera = camera;
		this.player = player;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.grid = data;
		this.width = mapW;
		this.height = mapH;

		this.mouse = {
			x: null,
			y: null,
			selection: { x: null, y: null },
		};
		this.map_editor = new MapEditor(
			this.c,
			this.camera,
			this.mouse,
			this.tilesize,
			this
		);
		this.cellWidth = this.tilesize;
		this.cellHeight = this.tilesize;

		this.color = "#000000";
	}

	mousemove(e) {
		this.mouse.x = e.offsetX;
		this.mouse.y = e.offsetY;
	}

	click(e) {
		let x = e.offsetX;
		let y = e.offsetY;
		let cameraX = this.camera.x;
		let cameraY = this.camera.y;

		if (
			x >= cameraX &&
			x <= cameraX + this.camera.width &&
			y >= cameraY &&
			y <= this.camera.height
		) {
			this.map_editor.tiles.push({
				x: this.mouse.selection.x,
				y: this.mouse.selection.y,
				tileType: "editor_cell",
				strokeStyle: "brown",
				fillStyle: "brown",
			});
		}
	}

	init() {
		this.map_editor.init();
		this.player.init();
		this.c.canvas.addEventListener("click", this.click.bind(this));
		this.c.canvas.addEventListener("mousemove", this.mousemove.bind(this));
	}

	getTile(col, row) {
		return this.grid[row * this.columns + col];
	}

	updateTileValue(col, row, value) {
		return (this.grid[row * this.columns + col].value = value);
	}

	snapToGrid(x, y, tilesize) {
		return {
			x: Math.round(x / tilesize) * tilesize,
			y: Math.round(y / tilesize) * tilesize,
		};
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	draw() {
		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();
		if (yMin < 0) yMin = 0;
		if (xMin < 0) xMin = 0;
		for (let x = xMin; x < xMax; x++) {
			for (let y = yMin; y < yMax; y++) {
				// draw grid within camera dimensions
				const tile = this.getTile(x, y);
				// !camera centering
				let tile_x =
					tile.x -
					this.camera.x +
					this.c.canvas.width / 2 -
					this.camera.width / 2;
				let tile_y =
					tile.y -
					this.camera.y +
					this.c.canvas.height / 2 -
					this.camera.height / 2;

				this.c.strokeStyle = tile.strokeStyle;
				this.c.fillStyle = tile.fillStyle;

				if (
					this.map_editor.mouse.x > tile_x &&
					this.map_editor.mouse.x < tile_x + this.tilesize &&
					this.map_editor.mouse.y > tile_y &&
					this.map_editor.mouse.y < tile_y + this.tilesize
				) {
					// set coords for mouse selection
					this.map_editor.mouse.selection = {
						x: tile_x,
						y: tile_y,
					};
				}

				const frame = tile.value - 1;

				if (
					tile.value === 23 &&
					tile.x === this.player.x &&
					tile.y === this.player.y
				) {
					console.log("youre on grass!!");
					this.updateTileValue(x, y, tile.value + 1);
				}

				this.drawSprite(
					images.ground_spritesheet,
					frame * this.tilesize,
					0,
					this.tilesize,
					this.tilesize,
					tile_x,
					tile_y,
					this.tilesize,
					this.tilesize
				);
			}
		}
	}

	update() {
		this.draw();
	}

	render() {
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		this.c.beginPath();
		this.update();
		this.player.update();
		this.map_editor.update();
	}
}
