import game_spritesheet from "../../images/game-spritesheet-new.png";

const images = {};

images.spritesheet = new Image();
images.spritesheet.onerror = console.error;
images.spritesheet.src = game_spritesheet;

// TODO: supply spritesheet to world constructor

export default class World {
	constructor(c, camera, { tilesize, rows, columns, data, mapW, mapH }, player) {
		this.c = c;
		this.camera = camera;
		this.player = player;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.grid = data;
		this.width = mapW;
		this.height = mapH;
		this.delta = 0;
		this.mouse = {
			x: null,
			y: null,
			selection: { x: null, y: null },
		};
		this.cellWidth = this.tilesize;
		this.cellHeight = this.tilesize;
		this.color = "#000000";
	}

	init() {
		this.player.init();
		this.player.collision.init(this.grid);
	}

	getTile(col, row) {
		return this.grid[row * this.columns + col];
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	draw() {
		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();
		for (let x = xMin; x < xMax; x++) {
			for (let y = yMin; y < yMax; y++) {
				// draw grid within camera dimensions
				const tile = this.getTile(x, y);
				//!camera centering
				let tile_x = tile.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2;
				let tile_y = tile.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2;

				this.drawSprite(
					images.spritesheet,
					tile.frameX * (this.tilesize / 2),
					tile.frameY * (this.tilesize / 2),
					this.tilesize / 2,
					this.tilesize / 2,
					tile_x,
					tile_y,
					this.tilesize,
					this.tilesize
				);
			}
		}
		this.player.draw();
	}

	update() {
		this.draw();
	}

	render(delta) {
		this.camera.update(this.player);
		this.player.update(delta);
		this.update();
	}
}
