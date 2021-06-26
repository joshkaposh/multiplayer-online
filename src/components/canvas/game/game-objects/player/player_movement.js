import PathFind from "./player_pathing";
import Mine from "./player_mine";
import Collision from "../../collision/collision";
// const keys = {};
// const keysElapsed = {};

class Move extends PathFind {
	constructor(c, camera, x, y, speed, columns, rows, mapW, mapH, tilesize) {
		super(c, camera, x, y, 0, 0);
		this.speed = speed;
		this.tilesize = tilesize;
		this.collision = new Collision(speed, tilesize, columns, rows, mapW, mapH);
		this.mine = new Mine(c, this.collision, speed, tilesize, columns, rows, mapW, mapH);

		this.moves = {
			keyW: () => {
				if (!this.isMoveWithinCamera("KeyW")) {
					this.camera.panUp();
					this.offset.addY(this.speed);
				}
				this.pos.subY(this.speed);
			},
			keyA: () => {
				if (!this.isMoveWithinCamera("KeyA")) {
					this.camera.panLeft();
					this.offset.addX(this.speed);
				}

				this.pos.subX(this.speed);
			},
			keyS: () => {
				if (!this.isMoveWithinCamera("KeyS")) {
					this.camera.panDown();
					this.offset.subY(this.speed);
				}

				this.pos.addY(this.speed);
			},
			keyD: () => {
				if (!this.isMoveWithinCamera("KeyD")) {
					this.camera.panRight();
					this.offset.subX(this.speed);
				}
				this.pos.addX(this.speed);
			},
		};
		this.isMoving = false;
		this.keys = {};
		this.keysElapsed = {};
		this.jumpHeight = this.speed.y * 2;
	}

	get topLeft() {
		return {
			x: this.pos.x,
			y: this.pos.y,
			row: Math.floor(this.pos.y / this.tilesize),
			column: Math.floor(this.pos.x / this.tilesize),
		};
	}
	get topRight() {
		return {
			x: this.pos.x + this.width,
			y: this.pos.y,
			row: Math.floor(this.pos.y / this.tilesize),
			column: Math.floor((this.pos.x + this.width) / this.tilesize),
		};
	}
	get bottomLeft() {
		return {
			x: this.pos.x,
			y: this.pos.y + this.height,
			row: Math.floor((this.height + this.y) / this.tilesize),
			column: Math.floor(this.pos.x / this.tilesize),
		};
	}
	get bottomRight() {
		return {
			x: this.pos.x + this.width,
			y: this.pos.y + this.height,
			row: Math.floor((this.pos.y + this.width) / this.tilesize),
			column: Math.floor((this.pos.x + this.height) / this.tilesize),
		};
	}

	_move(dir) {
		this.addToPreviousPositions();

		// ? Mining Section
		if (this.keys["KeyD"] && this.keys["Space"]) {
			this.mine.mine(this.collision.getTile(this.pos.x + this.tilesize + this.speed.x, this.pos.y));
		}

		if (this.keys["KeyA"] && this.keys["Space"]) {
			this.mine.mine(this.collision.getTile(this.pos.x - this.tilesize, this.pos.y));
		}

		if (this.keys["KeyS"] && this.keys["Space"]) {
			this.mine.mine(this.collision.getTile(this.pos.x, this.pos.y + this.tilesize + this.speed.y));
		}

		// ? Movement Section
		switch (dir) {
			case "KeyW":
				this.isMoving = true;
				if (this.pos.y - this.speed.y < 0) {
					return this.displayToUser(`cant move past world y limit: 0`);
				}
				if (!this.collision.collide_top([this.topLeft, this.topRight], this.speed)) {
					this.moves["keyW"]();
				}

				break;
			case "KeyA":
				this.isMoving = true;
				if (this.pos.x - this.speed.x < 0) {
					return this.displayToUser("cant move past world x limit: 0");
				}
				if (!this.collision.collide_left([this.topLeft, this.bottomLeft], this.speed)) {
					this.moves["keyA"]();
				}
				break;
			case "KeyS":
				this.isMoving = true;
				if (this.pos.y + this.height + this.speed.y > this.worldH) {
					return this.displayToUser(`cant move past world y limit: ${this.worldH}`);
				}
				if (!this.collision.collide_down([this.bottomLeft, this.bottomRight], this.speed)) {
					this.moves["keyS"]();
				}

				break;
			case "KeyD":
				this.isMoving = true;
				if (this.pos.x + this.width + this.speed.x > this.worldW) {
					return this.displayToUser(`cant move past world x limit: ${this.worldW}`);
				}
				if (!this.collision.collide_right([this.topRight, this.bottomRight], this.speed)) {
					this.moves["keyD"]();
				}
				break;
			case "Space":
				break;
			default:
				break;
		}
	}

	jump() {
		// this.y -= this.jumpHeight;
		// this.gravity.velocity = 0;
	}
}

export default class PlayerMovement extends Move {
	constructor(name, c, camera, x, y, tilesize, speed, width, height, mapW, mapH, columns, rows, color) {
		super(c, camera, x, y, speed, columns, rows, mapW, mapH, tilesize);
		this.name = name;
		this.c = c;
		this.camera = camera;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		// this.isJumping = false;
		// this.dx = 2;
		// this.dy = 2;
	}

	attachKeyListener(socket) {
		document.addEventListener("keydown", (e) => {
			this.keys[e.code] = true;
			document.getElementById("btnvalue").innerText = e.code;

			if (!this.keysElapsed[e.code]) {
				this.keysElapsed[e.code] = new Date();
			} else {
				document.getElementById("timevalue").innerText = 0;
			}

			this._move(e.code);
		});
		document.addEventListener("keyup", (e) => {
			this.keys[e.code] = false;

			let startTime = this.keysElapsed[e.code];
			let endTime = new Date();

			let timeElapsed = endTime - startTime;

			document.getElementById("timevalue").innerText = `${timeElapsed / 1000}`;

			delete this.keysElapsed[e.code];
		});
	}

	isMoveWithinCamera(dir) {
		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();
		const tilesize = this.tilesize;

		switch (dir) {
			case "KeyW":
				if ((this.pos.y - this.speed.y) / tilesize < yMin) {
					return false;
				}
				return true;
			case "KeyA":
				if ((this.pos.x - this.speed.x) / tilesize < xMin) {
					return false;
				}
				return true;
			case "KeyS":
				if ((this.pos.y + tilesize + this.speed.y) / tilesize > yMax) {
					return false;
				}
				return true;
			case "KeyD":
				if ((this.pos.x + tilesize + this.speed.x) / tilesize > xMax) {
					return false;
				}
				return true;
			default:
				break;
		}
	}
}
