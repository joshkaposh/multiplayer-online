import game_spritesheet from "../images/game-spritesheet-new.png";
import { frames } from "./frames/frames.json";
import { randomInt } from "./collision/util";
import Camera from "./render/camera";
import Vector from "./game-objects/basic/Vector";
import Player from "./game-objects/player/player";
import Enemy from "./game-objects/enemy/enemy";
import Shop from "./game-objects/shop/shop";
// !!! begin

const images = {};
images.spritesheet = new Image();
images.spritesheet.onerror = console.error;
images.spritesheet.src = game_spritesheet;

// TODO: supply spritesheet to world constructor
// !!! end
class PlayerSpawnSystem {
	setInitialStats(stats) {}

	initialStats() {
		const height = this.tilesize - this.tilesize / 5;
		return {
			width: this.tilesize / 3,
			height,
			position: new Vector(this.mapW / 4, this.tilesize * 3 - height),
		};
	}

	spawnPlayer({
		name,
		c,
		camera,
		health,
		pos,
		width,
		height,
		speed,
		tilesize,
		mapW,
		mapH,
		columns,
		rows,
		tileFrames,
		color,
	}) {
		return new Player(
			name,
			c,
			camera,
			health,
			pos,
			width,
			height,
			speed,
			tilesize,
			mapW,
			mapH,
			columns,
			rows,
			tileFrames,
			color
		);
	}
}

export default class GameWorld extends PlayerSpawnSystem {
	constructor(socket, c, playerName, { data: map, rows, columns, tilesize, mapW, mapH, frames }) {
		super();
		this.socket = socket;
		this.c = c;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.width = mapW;
		this.height = mapH;
		this.cellWidth = this.tilesize;
		this.cellHeight = this.tilesize;
		this.frames = frames;
		const playerWidth = tilesize / 3;
		const playerHeight = tilesize - tilesize / 5;
		const playerSpeed = new Vector(10, 10);
		const playerPosition = { x: mapW / 4, y: tilesize * 3 - playerHeight };
		const cameraPosition = new Vector(playerPosition.x, 0);
		const camera = new Camera(
			this.c,
			cameraPosition,
			c.canvas.width,
			c.canvas.height,
			tilesize,
			columns,
			rows,
			mapW,
			mapH
		);
		this.player = this.spawnPlayer({
			name: playerName,
			c,
			camera,
			health: 500,
			pos: playerPosition,
			width: playerWidth,
			height: playerHeight,
			speed: playerSpeed,
			tilesize,
			mapW,
			mapH,
			columns,
			rows,
			tileFrames: frames,
			color: "grey",
		});

		// TODO:
		this.spritesheet = images.spritesheet;
		this.camera = camera;
		this.layers = map;
		this.initialGrid = map;
		this.enemies = [];

		const shopHeight = tilesize * 2;
		const shopWidth = tilesize * 4;
		const shopPos = new Vector(mapW / 2, tilesize * 2);
		this.shop = new Shop(c, shopPos, shopWidth, shopHeight, tilesize, "grey");
		this.delta = null;
		this.totalDelta = null;
		this.lastDraw = null;
		this.mouse = {
			x: null,
			y: null,
			selection: { x: null, y: null },
		};

		this.color = "#000000";
		// TODO:
	}

	init() {
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		const canvas = document.getElementById("canvas");
		canvas.style.position = "absolute";

		this.frames = frames;

		console.log(this.layers);
		// for (let i = 0; i < this.layers[1].length; i++) {
		// 	const tile = this.layers[1][i];
		// 	if (tile !== 0) {
		// 		tile.update = function () {

		// 		};
		// 	}
		// }
		this.player.init(this.layers[1]);
		this.enemies.length = 0;
		this.spawnEnemies();
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

	animateTile(tile) {
		const { toxic } = tile.state;
		tile.lastDraw += this.delta;
		// console.log(toxic.frames.col);
		if (tile.lastDraw >= 8) {
			toxic.frames.col++;
			if (toxic.frames.col > toxic.frames.end) {
				toxic.frames.col = toxic.frames.end;
				toxic.is = false;
			}
			tile.lastDraw = this.delta;
		}
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
					this.spritesheet,
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
						this.spritesheet,
						tile.frameX * (this.tilesize / 2),
						tile.frameY * (this.tilesize / 2),
						this.tilesize / 2,
						this.tilesize / 2,
						tile_x,
						tile_y,
						this.tilesize,
						this.tilesize
					);
					if (tile.state.ore.is) {
						this.drawSprite(
							this.spritesheet,
							tile.state.ore.frames.col * (this.tilesize / 2),
							tile.state.ore.frames.row * (this.tilesize / 2),
							this.tilesize / 2,
							this.tilesize / 2,
							tile_x,
							tile_y,
							this.tilesize,
							this.tilesize
						);
					}
				}
				if (tile && tile.type === "mined" && tile.state.toxic.is) {
					this.drawSprite(
						this.spritesheet,
						tile.state.toxic.frames.col * (this.tilesize / 2),
						tile.state.toxic.frames.row * (this.tilesize / 2),
						this.tilesize / 2,
						this.tilesize / 2,
						tile_x,
						tile_y,
						this.tilesize,
						this.tilesize
					);
					this.animateTile(tile);
				}
			}
		}
	}

	drawUI() {
		this.player.drawMoney();
	}

	draw() {
		this.drawTiles();
		this.player.draw();
		// this.drawEnemies();
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

	render(delta) {
		this.camera.update(this.player);
		this.player.update(delta, this.shop);
		this.draw();
		this.shop.update(this.camera);
		this.drawUI();
	}

	update(delta, anId) {
		this.c.imageSmoothingEnabled = false;
		this.delta = delta;
		this.lastDraw += delta;
		this.render(delta);
	}
}
