import PlayerMovement from "./player_movement";
import Sprite from "../../sprite/sprite";
import io from "socket.io-client";
import Vector from "../basic/Vector";
import playerSpritesheet from "../../../images/player-spritesheet.png";

const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(name, c, camera, x, y, tilesize, speed, width, height, mapW, mapH, columns, rows, color) {
		super(name, c, camera, x, y, tilesize, speed, width, height, mapW, mapH, columns, rows, color);
		this.name = name;
		this.c = c;
		this.x = x;
		this.y = y;
		this.pos = new Vector(x, y);
		this.offset = new Vector(0, 0);
		this.speed = new Vector(speed.x, speed.y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.sprite = new Sprite(this.c, playerSpritesheet, this.x, this.y, this.width, this.height);
		this.facingDirection = "";
		this.status = "";
		// this.gravity = {
		// 	velocity: 0,
		// 	multiplier: 0.05,
		// };
		// this.friction = 0.01;
	}

	displayToUser(msg) {
		const tag = document.getElementsByClassName("player-info")[0];
		const h2 = document.getElementsByClassName("player-info")[0].firstChild;
		h2.innerText = msg;

		if (h2.innerText) {
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

	offsetToCamera({ x, y, column, row }) {
		return {
			x: x - this.camera.x + this.c.canvas.width / 2 - this.camera.width / 2,
			y: y - this.camera.y + this.c.canvas.height / 2 - this.camera.height / 2,
			column: column,
			row: row,
		};
	}

	draw() {
		this.c.fillStyle = this.color;
		// ! change x,y to pos.x,y
		let player_x = this.pos.x - this.camera.x + this.c.canvas.width / 2 - this.camera.width / 2;
		let player_y = this.pos.y - this.camera.y + this.c.canvas.height / 2 - this.camera.height / 2;
		this.c.beginPath();

		if (!this.isMoving) {
			this.sprite.frameX = 0;
			this.sprite.frameY = 0;
		}

		if (this.isMining) {
			this.mine.drill.current_loop_index++;

			if (this.mine.drill.current_loop_index >= this.mine.drill.frame_limit) {
				this.mine.drill.current_loop_index = 0;
			}
			this.sprite.frameY = this.mine.drill.frameY;
			// console.log("INDEX: ", this.mine.drill.current_loop_index);
			// console.log(this.facingDirection);
			// console.log(this.mine.drill.frame_loops[this.facingDirection]);
			this.sprite.frameX = this.mine.drill.frame_loops[this.facingDirection][this.mine.drill.current_loop_index];
		}

		if (!this.isMining) {
			this.sprite.frameX = 0;
			this.sprite.frameY = 0;
		}

		this.sprite.draw(player_x, player_y);
		// this.c.fillRect(player_x, player_y, this.width, this.height);
		document.getElementById("score").innerText = this.mine.score;
	}

	fall() {
		if (this.collision.collide_down([this.bottomLeft, this.bottomRight], this.speed)) {
			this.dy = 0;
		} else {
			this.dy += 1;
		}
		this.y += this.dy;
	}

	update() {
		this.draw();
	}
	init() {
		this.attachKeyListener(socket);
	}
}
