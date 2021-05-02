import spritesheet from "../../../images/spritesheet.png";

const images = {};

images.pathing_spritesheet = new Image();

images.pathing_spritesheet.onerror = function (err) {
	console.error(err);
};
images.pathing_spritesheet.src = spritesheet;

export default class PathFind {
	constructor(turnmanager, c, x, y) {
		this.turnmanager = turnmanager;
		this.c = c;
		this.x = x;
		this.y = y;
		this.previousPositions = [];
		this.paths = [];
	}

	getPaths() {
		return this.pathcheck(this.x, this.y, this.speed);
	}

	getAvailablePaths() {
		const paths = this.getPaths();
		const filtered = this.removeAvailableFromPrevious(paths);
		this.paths = filtered;
		return filtered;
	}

	removeAvailableFromPrevious(paths) {
		const temp = [];

		this.previousPositions.forEach((prevPos) => {
			for (let i = 0; i < paths.length; i++) {
				if (prevPos.x === paths[i].x && prevPos.y === paths[i].y) {
					paths.splice(i, 1);
				} else {
					temp.push(paths[i]);
				}
			}
		});

		return temp;
	}

	addToPreviousPositions() {
		this.previousPositions.push({ x: this.x, y: this.y });
	}

	setAvailablePaths() {
		const paths = this.getPaths();

		this.paths = paths;
		return this.paths;
	}

	pathcheck(x, y, speed) {
		const availablePaths = [];

		if (x + speed.x <= 600) {
			availablePaths.push({
				x: x + speed.x,
				y: y,
				dir: "right",
				frame: 0,
			});
		}
		if (x - speed.x >= 0) {
			availablePaths.push({
				x: x - speed.x,
				y: y,
				dir: "left",
				frame: 1,
			});
		}
		if (y - speed.y >= 0) {
			availablePaths.push({ x: x, y: y - speed.y, dir: "up", frame: 2 });
		}
		if (y + speed.y <= 400) {
			availablePaths.push({
				x: x,
				y: y + speed.y,
				dir: "down",
				frame: 3,
			});
		}
		return availablePaths;
	}

	drawPreviousPaths() {
		for (let i = 0; i < this.previousPositions.length; i++) {
			const x = this.previousPositions[i].x;
			const y = this.previousPositions[i].y;

			this.c.beginPath();
			this.c.fillStyle = "blue";
			this.c.fillRect(x, y, 60, 40);
		}
	}
	/*
	!spritesheet indexes
:	0 = right arrow
:	1 left arrow
:	2 right arrow
:	3 up arrow
:	4 down arrow
:	5 castle
:	6 trees

		this.c.drawImage(
				images.playerSpritesheet,
				this.width * this.frameX,
				this.height * this.frameY,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
*/
	drawPathSprites({ func, cameraX, cameraY, cameraW, cameraH }) {
		this.setAvailablePaths();
		// const xOffset = 10;
		// const yOffset = 0;
		const tilesize = 32;
		const width = 64;
		const height = 64;
		const img = images.pathing_spritesheet;
		if (img.complete) {
			for (let i = 0; i < this.paths.length; i++) {
				// let x = this.paths[i].x;
				// let y = this.paths[i].y;
				let x = func(
					this.paths[i].x,
					null,
					cameraX,
					cameraY,
					cameraW,
					cameraH,
					this.c.canvas.width,
					this.c.canvas.height
				);
				let y = func(
					null,
					this.paths[i].y,
					cameraX,
					cameraY,
					cameraW,
					cameraH,
					this.c.canvas.width,
					this.c.canvas.height
				);

				switch (this.paths[i].dir) {
					case "up":
						this.c.drawImage(
							images.pathing_spritesheet,
							tilesize * this.paths[i].frame,
							0,
							tilesize,
							tilesize,
							x,
							y,
							width,
							height
						);
						break;
					case "down":
						this.c.drawImage(
							images.pathing_spritesheet,
							tilesize * this.paths[i].frame,
							0,
							tilesize,
							tilesize,
							x,
							y,
							width,
							height
						);
						break;
					case "left":
						this.c.drawImage(
							images.pathing_spritesheet,
							tilesize * this.paths[i].frame,
							0,
							tilesize,
							tilesize,
							x,
							y,
							width,
							height
						);
						break;
					case "right":
						this.c.drawImage(
							images.pathing_spritesheet,
							tilesize * this.paths[i].frame,
							0,
							tilesize,
							tilesize,
							x,
							y,
							width,
							height
						);
						break;
					default:
						break;
				}
			}
		}
	}

	drawPaths() {
		this.setAvailablePaths();
		for (let i = 0; i < this.paths.length; i++) {
			const x = this.paths[i].x;
			const y = this.paths[i].y;
			this.c.beginPath();
			this.c.fillStyle = "red";
			this.c.fillRect(x, y, 60, 40);
		}
	}
}
