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
			new Inventory(c, 500, { copper: [], iron: [] }),
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
		this.spawnPoint = pos.clone();
		this.offset = new Vector(0, 0);
		this.speed = new Vector(speed.x, speed.y);
		this.width = width;
		this.height = height;
		this.color = color;
		this.facingDirection = { down: false, facing: "right" };
		this.status = "";
		this.delta = null;
		this.totalDelta = null;
		this.lastDraw = null;
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

	drawStats() {
		document.getElementById("status").innerText = this.status;
		document.getElementById("position").innerText = `{ x: ${Math.trunc(this.pos.x)}, y: ${Math.trunc(
			this.pos.y
		)} }`;
		document.getElementById("velocity").innerText = `{ x: ${this.velocity.x.toFixed(
			4
		)}, y: ${this.velocity.y.toFixed(4)} }`;
	}

	drawHealth() {
		let hp = invlerp(this.minHP, this.maxHP, this.health);
		this.c.beginPath();
		this.c.strokeStyle = "#000";
		this.c.fillStyle = "#fff";
		this.c.font = "25px Arial";
		this.c.fillText("Health:", 20, 30);
		this.c.fillStyle = "#ff0000";
		this.c.strokeStyle = "#fff";
		this.c.fillRect(110, 14, hp * 100, 20);
		this.c.rect(110, 14, 100, 20);
		this.c.stroke();
		this.c.closePath();
	}

	draw() {
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		let offsetX = this.width; // for sprite
		let offsetY = this.height / 5 + 2;
		let player_x = Math.ceil(this.pos.x - this.camera.pos.x + this.c.canvas.width / 2 - this.camera.width / 2);
		let player_y = Math.ceil(this.pos.y - this.camera.pos.y + this.c.canvas.height / 2 - this.camera.height / 2);
		this.drill.sprite.draw(player_x - offsetX, player_y - offsetY);
		this.c.rect(player_x, player_y, this.width, this.height);
		this.c.stroke();
		this.c.closePath();
		this.drawStats();
		this.drawHealth();
	}

	update(delta, totalDelta, shop) {
		this.delta = delta;
		// this.totalDelta = totalDelta;
		this.lastDraw += delta;

		if (this.inventory.retry) {
		}

		this._move(shop);

		// TODO: figure out whats making player 'jumpy'

		if (this.lastDraw >= 0.5) {
			this.status = this.drill.sprite.updateFrames(
				{
					isMoving: this.isMoving,
					isMining: this.isMining,
					isShopping: this.isShopping,
					isGrounded: this.isGrounded,
					isFlying: this.isFlying,
				},
				this.facingDirection,
				delta
			);
			this.lastDraw = delta;
		}

		if (!this.isShopping) {
			this.damageOverTime();
		}

		// TODO: check if player is in shop tile AND is grounded
		this.inventory.updateUI(this.health);
		// ! world.render handles drawing
	}

	init() {
		this.attachKeyListener(socket);
		this.inventory.init(this);
	}
}
