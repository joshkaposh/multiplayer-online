import PlayerMovement from "./player_movement";
import Sprite from "../../sprite/sprite";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(name, c, camera, x, y, tilesize, speed, width, height, color) {
		super(name, c, camera, x, y, tilesize, speed);
		this.name = name;
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
	draw() {
		this.c.fillStyle = this.color;
		let offset = this.tilesize / 2;

		let player_x =
			this.x -
			this.camera.x +
			this.c.canvas.width / 2 -
			this.camera.width / 2 +
			offset;

		let player_y =
			this.y -
			this.camera.y +
			this.c.canvas.height / 2 -
			this.camera.height / 2 +
			offset;

		this.c.beginPath();
		this.c.arc(player_x, player_y, 24, 0, Math.PI * 2, false);
		this.c.fill();
		this.drawPathSprites(player_x, player_y);
	}

	update() {
		this.draw();
	}
	init() {
		this.attachKeyListener(socket);
	}
}
