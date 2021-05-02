import PathFind from "./player_pathing";
import { GridInfo } from "../../map/world";

console.log(GridInfo());

export default class PlayerMovement extends PathFind {
	constructor(name, turnmanager, c, camera, x, y, speed) {
		super(turnmanager, c, x, y, speed);
		this.name = name;
		this.turnmanager = turnmanager;
		this.c = c;
		this.camera = camera;
		this.x = x;
		this.y = y;
	}

	attachKeyListener(socket) {
		document.addEventListener("keydown", (e) => {
			switch (e.code) {
				case "KeyW":
					this.y - this.speed.y >= 0
						? this._move("w")
						: this.promptUser(
								`Unable to move ${e.code}: select a better path.`
						  );
					break;
				case "KeyA":
					this.x - this.speed.x >= 0
						? this._move("a")
						: this.promptUser(
								`Unable to move ${e.code}: select a better path.`
						  );

					break;
				case "KeyS":
					this.y + this.speed.y <= 400
						? this._move("s")
						: this.promptUser(
								`Unable to move ${e.code}: select a better path.`
						  );

					break;
				case "KeyD":
					this.x + this.speed.x <= 600
						? this._move("d")
						: this.promptUser(
								`Unable to move ${e.code}: select a better path.`
						  );

					break;
				default:
					break;
			}
		});
	}

	_move(dir) {
		this.addToPreviousPositions();

		switch (dir) {
			case "w":
				this.y -= this.speed.y;

				break;
			case "a":
				this.x -= this.speed.x;

				break;
			case "s":
				this.y += this.speed.y;

				break;
			case "d":
				this.x += this.speed.x;

				break;
			default:
				break;
		}
		this.camera.follow();
		// console.log("availablePositions::", this.getPaths());

		// console.log("previousPaths::", this.previousPositions);
		// console.log(
		// 	"removeAvailableFromPrevious::",
		// 	this.removeAvailableFromPrevious(this.setAvailablePaths())
		// );
		// console.log("setAvailablePaths::", this.setAvailablePaths());

		// console.log(`x: ${this.x}, y: ${this.y}, direction: ${dir}`);

		// this.manager.endTurn(this.name, dir);
	}
}
