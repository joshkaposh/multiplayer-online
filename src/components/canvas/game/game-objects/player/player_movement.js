import PathFind from "./player_pathing";

class Move extends PathFind {
	constructor(c, camera, x, y, tilesize) {
		super(c, camera, x, y, 0, 0);
		this.tilesize = tilesize;
	}

	_move(dir) {
		this.addToPreviousPositions();
		// const width =
		// 	document.getElementsByClassName("MapInfo")[0].children[1]
		// 		.children[0].firstChild;
		// const height =
		// 	document.getElementsByClassName("MapInfo")[0].children[1]
		// 		.children[0].lastChild;

		switch (dir) {
			case "KeyW":
				this.moveUp();
				break;
			case "KeyA":
				this.moveLeft();
				break;
			case "KeyS":
				this.moveDown();
				break;
			case "KeyD":
				this.moveRight();
				break;
			default:
				break;
		}
	}

	moveLeft() {
		if (this.x - this.speed.x < 0) {
			return this.displayToUser("cant move past world x limit: 0");
		}

		if (!this.isMoveWithinCamera("KeyA")) {
			this.camera.panLeft();
			this.offsetX += this.speed.x;
		}

		this.x -= this.speed.x;
	}

	moveRight() {
		const worldWidth = this.tilesize * 20;
		if (this.x + this.tilesize + this.speed.x > worldWidth) {
			return this.displayToUser(
				`cant move past world x limit: ${worldWidth}`
			);
		}

		if (!this.isMoveWithinCamera("KeyD")) {
			this.camera.panRight();
			this.offsetX -= this.tilesize;
		}

		this.x += this.speed.x;
	}

	moveUp() {
		if (this.y - this.speed.y < 0) {
			return this.displayToUser(`cant move past world y limit 0`);
		}

		if (!this.isMoveWithinCamera("KeyW")) {
			this.camera.panUp();
			this.offsetY += this.speed.y;
		}
		this.y -= this.speed.y;
	}

	moveDown() {
		const worldHeight = this.tilesize * 20;

		if (this.y + this.tilesize + this.speed.y > worldHeight) {
			return this.displayToUser(
				`cant move past world y limit: ${worldHeight}`
			);
		}

		if (!this.isMoveWithinCamera("KeyS")) {
			this.camera.panDown();
			this.offsetY -= this.speed.y;
		}

		this.y += this.speed.y;
	}
}

export default class PlayerMovement extends Move {
	constructor(name, c, camera, x, y, tilesize, speed) {
		super(c, camera, x, y, tilesize, speed);
		this.name = name;
		this.c = c;
		this.camera = camera;
		this.x = x;
		this.y = y;
		this.tilesize = tilesize;
	}

	displayToUser(msg) {
		const tag = document.getElementsByClassName("player-info")[0];
		const h2 = document.getElementsByClassName("player-info")[0].firstChild;
		h2.innerText = msg;

		if (h2.innerText) {
			document.getElementsByClassName("player-info")[0].style.display =
				"block";
		}

		tag.classList.toggle("visible", true);
		tag.classList.toggle("invisible", false);

		let timer = setTimeout(() => {
			tag.classList.toggle("visible", false);
			tag.classList.toggle("invisible", true);

			clearTimeout(timer);
		}, 2500);
	}

	attachKeyListener(socket) {
		document.addEventListener("keydown", (e) => {
			this._move(e.code);
		});
	}

	isMoveWithinCamera(dir) {
		let { xMin, xMax, yMin, yMax } = this.camera.getDimensions();
		const tilesize = 64;

		switch (dir) {
			case "KeyW":
				if ((this.y - this.speed.y) / 64 < yMin) {
					return false;
				}
				return true;
			case "KeyA":
				if ((this.x - this.speed.x) / 64 < xMin) {
					return false;
				}
				return true;
			case "KeyS":
				if ((this.y + tilesize + this.speed.y) / 64 > yMax) {
					return false;
				}
				return true;
			case "KeyD":
				if ((this.x + tilesize + this.speed.x) / 64 > xMax) {
					return false;
				}
				return true;
			default:
				break;
		}
	}
}
