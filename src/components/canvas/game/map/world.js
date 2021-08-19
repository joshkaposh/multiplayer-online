import game_spritesheet from "../../images/game-spritesheet-new.png";
import Vector from "../game-objects/basic/Vector";
import { randomInt } from "../collision/util";
import Shop from "../game-objects/shop/shop";
import Enemy from "../game-objects/enemy/enemy";
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
		this.layers = data;
		this.initialGrid = data;
		this.width = mapW;
		this.height = mapH;
		const shopHeight = tilesize * 2;
		const shopWidth = tilesize * 4;
		const shopPos = new Vector(mapW / 2, tilesize * 2);
		this.shop = new Shop(c, shopPos, shopWidth, shopHeight, tilesize, "grey");
		this.delta = 0;
		this.mouse = {
			x: null,
			y: null,
			selection: { x: null, y: null },
		};
		this.enemies = [];
		this.cellWidth = this.tilesize;
		this.cellHeight = this.tilesize;
		this.color = "#000000";
	}

	spawnEnemies() {
		for (let i = 0; i < 5; i++) {
			let x = randomInt(0, this.width);
			let y = randomInt(0, 4 * this.tilesize);
			// between sky and grass;

			this.enemies.push(
				new Enemy(
					this.c,
					new Vector(x, y),
					this.tilesize / 4,
					this.tilesize / 4,
					this.tilesize * 3,
					new Vector(this.tilesize / 4, this.tilesize / 4),
					"red"
				)
			);
		}
	}

	init() {
		this.player.init();
		this.player.collision.init(this.layers[1]);
		this.enemies.length = 0;
		this.spawnEnemies();
	}

	getTile(col, row) {
		return this.layers[1][row * this.columns + col];
	}

	getBgTile(col, row) {
		return this.layers[0][row * this.columns + col];
	}

	drawEnemies() {
		if (this.enemies.length > 0) {
			for (let i = 0; i < this.enemies.length; i++) {
				let x = this.enemies[i].pos.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2;
				let y = this.enemies[i].pos.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2;
				this.enemies[i].draw(x, y);
			}
		}
	}

	drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
		this.c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
	}

	drawTiles() {
		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();
		for (let x = xMin; x < xMax; x++) {
			for (let y = yMin; y < yMax; y++) {
				// draw grid within camera dimensions
				const tile = this.getTile(x, y);
				const bgTile = this.getBgTile(x, y);

				let tile_x = bgTile.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2;
				let tile_y = bgTile.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2;

				this.drawSprite(
					images.spritesheet,
					bgTile.frameX * (this.tilesize / 2),
					bgTile.frameY * (this.tilesize / 2),
					this.tilesize / 2,
					this.tilesize / 2,
					tile_x,
					tile_y,
					this.tilesize,
					this.tilesize
				);
				//!camera centering
				if (tile && tile.type !== "mined") {
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
					if (tile.isOre) {
						this.drawSprite(
							images.spritesheet,
							tile.oreFrames.col * (this.tilesize / 2),
							tile.oreFrames.row * (this.tilesize / 2),
							this.tilesize / 2,
							this.tilesize / 2,
							tile_x,
							tile_y,
							this.tilesize,
							this.tilesize
						);
					}
				}
			}
		}
	}

	draw() {
		this.drawTiles();
		// this.drawEnemies();
		this.player.draw();
	}

	resetWorld() {
		// enterDeath
		this.grid = this.initialGrid;
		this.player.garbage();
	}

	displayDeathMenu() {
		const menu = document.getElementById("death-menu");
		menu.setAttribute("class", "show");
	}

	render(delta, totalDelta) {
		// if (this.enemies.length > 0) {
		// for (let i = 0; i < this.enemies.length; i++) {
		// 	this.enemies[i].update(this.player);
		// }
		// }

		this.camera.update(this.player);
		this.player.update(delta, totalDelta, this.shop);
		this.draw();
		this.shop.update(this.camera);
		this.player.inventory.drawMoney();
	}

	update(delta, totalDelta) {
		// if (!this.player.isAlive) {
		// should die
		// this.resetWorld()
		// this.displayDeathMenu();
		// }
		this.render(delta, totalDelta);
	}
}
