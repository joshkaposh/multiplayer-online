import PlayerMovement from "./player_movement";
import io from "socket.io-client";
import Vector from "../basic/Vector";
import playerSpritesheet from "../../../images/player-spritesheet.png";

const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(name, c, camera, pos, tilesize, speed, width, height, mapW, mapH, columns, rows, color) {
		super(
			c,
			camera,
			playerSpritesheet,
			pos.x,
			pos.y,
			width,
			height,
			tilesize,
			speed,
			mapW,
			mapH,
			columns,
			rows,
			color
		);
		this.name = name;
		this.c = c;
		this.pos = pos;
		this.offset = new Vector(0, 0);
		this.speed = new Vector(speed.x, speed.y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.facingDirection = "";
		this.status = "";
		this.delta = null;
	}

	displayToUser(msg) {
		const tag = document.getElementsByClassName("player-info")[0];
		const h2 = document.getElementsByClassName("player-info")[0].firstChild;
		if (msg) {
			h2.innerText = msg;
			document.getElementsByClassName("player-info")[0].style.display = "block";
		}
		tag.classList.toggle("visible", true);
		tag.classList.toggle("invisible", false);

		let timer = setTimeout(() => {
			tag.classList.toggle("visible", false);
			tag.classList.toggle("invisible", true);

			clearTimeout(timer);
		}, 2500);
	}

	draw() {
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		let offsetX = this.width / 4; // for sprite
		let player_x = Math.round(this.pos.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2);
		let player_y = Math.round(this.pos.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2);
		this.c.beginPath();
		this.drill.sprite.draw(player_x - offsetX, player_y);
		this.c.rect(player_x, player_y, this.width, this.height);
		this.c.stroke();
		document.getElementById("status").innerText = this.status;
	}

	update(delta) {
		let status = "";
		this.delta = delta;
		this._move();

		if (this.isMoving) status = "Moving";

		if (this.isMining && !this.isMoving) {
			status = "Mining";
			this.drill.sprite.index++;
			if (this.drill.sprite.index >= this.drill.sprite.frame_limit) {
				this.drill.sprite.index = 0;
			}
		}

		if (!this.isMining && !this.isMoving) {
			status = "Idling";
			this.drill.sprite.frameX = 0;
			this.drill.sprite.frameY = 0;
		}

		this.status = status;
		// ! world.render handles drawing
	}
	init() {
		this.attachKeyListener(socket);
	}
}
