import PlayerMovement from "./player_movement";
import Sprite from "../../sprite/sprite";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(name, manager, c, camera, x, y, speed, width, height, color) {
		super(name, manager, c, camera, x, y, speed);
		this.name = name;
		this.manager = manager;
		this.c = c;
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.width = width;
		this.height = height;
		this.color = color;
		this.sprite = new Sprite(this.c, this.x, this.y);
		this.status = "";
		this.dirs = ["left", "right", "up", "down"];
	}

	promptUser(msg) {
		this.status = msg;
	}

	drawSprite(img) {
		this.c.beginPath();
		this.c.drawImage(img, 0, 0);
	}

	draw() {
		let x = this.camera.offsetToMiddle(
			this.x,
			null,
			this.camera.x,
			this.camera.y,
			this.camera.width,
			this.camera.height,
			this.c.canvas.width,
			this.c.canvas.height
		);
		let y = this.camera.offsetToMiddle(
			null,
			this.y,
			this.camera.x,
			this.camera.y,
			this.camera.width,
			this.camera.height,
			this.c.canvas.width,
			this.c.canvas.height
		);

		this.c.beginPath();
		this.c.fillStyle = this.color;

		this.c.fillRect(x, y, this.width, this.height);
		// this.drawPaths();
		// todo: get pathingSprites aligned to camera centering
		this.drawPathSprites({
			func: this.camera.offsetToMiddle,
			cameraX: this.camera.x,
			cameraY: this.camera.y,
			cameraW: this.camera.width,
			cameraH: this.camera.height,
		});
		// this.drawPreviousPaths();
	}

	update() {
		// this.sprite.update(this.x, this.y);
		// ? sprite is right arrow;
		this.draw();
	}
	init() {
		this.attachKeyListener(socket);
	}
}
