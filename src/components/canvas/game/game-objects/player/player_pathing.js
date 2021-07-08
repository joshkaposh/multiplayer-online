// import spritesheet from "../../../images/spritesheet.png";

// const images = {};

// images.pathing_spritesheet = new Image();

// images.pathing_spritesheet.onerror = function (err) {
// 	console.error(err);
// };
// images.pathing_spritesheet.src = spritesheet;

// export default class PathFind {
// 	constructor(c, camera, x, y, offsetX, offsetY) {
// 		this.c = c;
// 		this.camera = camera;
// 		this.x = x;
// 		this.y = y;
// 		this.offsetX = offsetX;
// 		this.offsetY = offsetY;
// 		this.worldW = parseInt(
// 			document.getElementsByClassName("MapInfo")[0].children[1].children[0].firstChild.innerText
// 		);
// 		this.worldH = parseInt(
// 			document.getElementsByClassName("MapInfo")[0].children[1].children[0].lastChild.innerText
// 		);

// 		this.previousPositions = [];
// 		this.paths = [];
// 	}

// 	getPaths() {
// 		return this.pathcheck(this.x, this.y, this.speed);
// 	}

// 	getAvailablePaths() {
// 		const paths = this.getPaths();
// 		const filtered = this.removeAvailableFromPrevious(paths);
// 		this.paths = filtered;
// 		return filtered;
// 	}

// 	removeAvailableFromPrevious(paths) {
// 		const temp = [];

// 		this.previousPositions.forEach((prevPos) => {
// 			for (let i = 0; i < paths.length; i++) {
// 				if (prevPos.x === paths[i].x && prevPos.y === paths[i].y) {
// 					paths.splice(i, 1);
// 				} else {
// 					temp.push(paths[i]);
// 				}
// 			}
// 		});

// 		return temp;
// 	}

// 	addToPreviousPositions() {
// 		this.previousPositions.push({ x: this.x, y: this.y });
// 	}

// 	setAvailablePaths() {
// 		const paths = this.getPaths();

// 		this.paths = paths;
// 		return this.paths;
// 	}

// 	pathcheck(x, y, speed) {
// 		const availablePaths = [];

// 		if (x + speed.x <= this.worldW) {
// 			availablePaths.push({
// 				x: x + speed.x,
// 				y: y,
// 				dir: "right",
// 				frame: 0,
// 			});
// 		}
// 		if (y + speed.y <= this.worldH) {
// 			availablePaths.push({
// 				x: x,
// 				y: y + speed.y,
// 				dir: "down",
// 				frame: 3,
// 			});
// 		}
// 		if (x - speed.x >= 0) {
// 			availablePaths.push({
// 				x: x - speed.x,
// 				y: y,
// 				dir: "left",
// 				frame: 1,
// 			});
// 		}
// 		if (y - speed.y >= 0) {
// 			availablePaths.push({ x: x, y: y - speed.y, dir: "up", frame: 2 });
// 		}

// 		return availablePaths;
// 	}

// 	drawPreviousPaths() {
// 		for (let i = 0; i < this.previousPositions.length; i++) {
// 			const x = this.previousPositions[i].x;
// 			const y = this.previousPositions[i].y;

// 			this.c.beginPath();
// 			this.c.fillStyle = "blue";
// 			this.c.fillRect(x, y, 60, 40);
// 		}
// 	}
// 	/*
// 	!spritesheet indexes
// :	0 = right arrow
// :	1 left arrow
// :	2 right arrow
// :	3 up arrow
// :	4 down arrow
// :	5 castle
// :	6 trees
// */
// 	drawPathSprites() {
// 		this.setAvailablePaths();
// 		const tilesize = 32;
// 		const width = 64;
// 		const height = 64;
// 		const img = images.pathing_spritesheet;
// 		if (img.complete) {
// 			for (let i = 0; i < this.paths.length; i++) {
// 				let x = this.paths[i].x;
// 				let y = this.paths[i].y;

// 				x = this.paths[i].x - this.camera.width / 2 + this.c.canvas.width / 2 + this.offsetX;
// 				y = this.paths[i].y - this.camera.height / 2 + this.c.canvas.height / 2 + this.offsetY;

// 				switch (this.paths[i].dir) {
// 					case "up":
// 						this.c.drawImage(
// 							images.pathing_spritesheet,
// 							tilesize * this.paths[i].frame,
// 							0,
// 							tilesize,
// 							tilesize,
// 							x,
// 							y,
// 							width,
// 							height
// 						);
// 						break;
// 					case "down":
// 						this.c.drawImage(
// 							images.pathing_spritesheet,
// 							tilesize * this.paths[i].frame,
// 							0,
// 							tilesize,
// 							tilesize,
// 							x,
// 							y,
// 							width,
// 							height
// 						);
// 						break;
// 					case "left":
// 						this.c.drawImage(
// 							images.pathing_spritesheet,
// 							tilesize * this.paths[i].frame,
// 							0,
// 							tilesize,
// 							tilesize,
// 							x,
// 							y,
// 							width,
// 							height
// 						);
// 						break;
// 					case "right":
// 						this.c.drawImage(
// 							images.pathing_spritesheet,
// 							tilesize * this.paths[i].frame,
// 							0,
// 							tilesize,
// 							tilesize,
// 							x,
// 							y,
// 							width,
// 							height
// 						);
// 						break;
// 					default:
// 						break;
// 				}
// 			}
// 		}
// 	}
// }
