import PlayerMovement from "./player_movement";
import Inventory from "./player_inventory";
import io from "socket.io-client";
import Vector from "../basic/Vector";
import playerSpritesheet from "../../../images/player-spritesheet.png";
import { invlerp } from "../../collision/util";

const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(name, c, camera, pos, tilesize, speed, width, height, mapW, mapH, columns, rows, tileFrames, color) {
		super(
			c,
			new Inventory(c),
			camera,
			playerSpritesheet,
			width,
			height,
			tilesize,
			speed,
			mapW,
			mapH,
			columns,
			rows,
			tileFrames,
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

	drawScore() {
		document.getElementById("status").innerText = this.status;
		document.getElementById("position").innerText = `Player Position: { x: ${Math.trunc(
			this.pos.x
		)}, y: ${Math.trunc(this.pos.y)} }`;
	}

	drawHealth() {
		let hp = invlerp(this.minHP, this.maxHP, this.health);
		this.c.beginPath();
		this.c.strokeStyle = "#000";
		this.c.fillStyle = "#000";

		this.c.font = "25px Arial";
		this.c.fillText("Health:", 20, 30);
		this.c.fillStyle = "#ff0000";

		this.c.fillRect(110, 14, hp * 100, 20);
		this.c.rect(110, 14, 100, 20);
		this.c.stroke();
		this.c.closePath();
	}

	updateFrames() {
		let status = "";

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
		return status;
	}

	draw() {
		this.c.beginPath();

		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		let offsetX = this.width / 4; // for sprite
		let player_x = Math.ceil(this.pos.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2);
		let player_y = Math.ceil(this.pos.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2);
		this.drill.sprite.draw(player_x - offsetX, player_y);
		this.c.rect(player_x, player_y, this.width, this.height);
		this.c.stroke();
		this.c.closePath();
		this.drawScore();
		this.drawHealth();
	}

	update(delta, shop) {
		this.delta = delta;
		this._move(shop);

		this.status = this.updateFrames();

		// TODO: check if player is in shop tile AND is grounded
		this.inventory.updateUI();
		// ! world.render handles drawing
	}

	init() {
		this.attachKeyListener(socket);
		this.inventory.init();
	}
}
