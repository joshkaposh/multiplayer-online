import PlayerMovement from "./player_movement";
import io from "socket.io-client";
import Vector from "../basic/Vector";
import PlayerSprite from "./player_sprite";
import playerSpritesheet from "../../../images/player-spritesheet.png";
import { invlerp } from "../../collision/util";
const socket = io("http://localhost:5000");

export default class Player extends PlayerMovement {
	constructor(
		name,
		c,
		camera,
		health,
		pos,
		width,
		height,
		speed,
		tilesize,
		mapW,
		mapH,
		columns,
		rows,
		tileFrames,
		color
	) {
		super(c, camera, health, pos, width, height, speed, tilesize, mapW, mapH, columns, rows, tileFrames);
		this.name = name;
		this.c = c;
		this.spawnPoint = new Vector(pos.x, pos.y);
		this.offset = new Vector(0, 0);
		this.sprite = new PlayerSprite(c, playerSpritesheet, 32, 32, 2, 2);
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

	drawMoney() {
		this.c.beginPath();
		this.c.strokeStyle = "#000";
		this.c.fillStyle = "#000";
		this.c.font = "25px Arial";
		this.c.fillText("$" + this.inventory.currency, this.c.canvas.width - 100, 30);
	}

	drawStats() {
		document.getElementById("currency").innerText = this.inventory.currency;
		document.getElementById("status").innerText = this.status;
		document.getElementById("position").innerText = `{ x: ${Math.trunc(this.pos.x)}, y: ${Math.trunc(
			this.pos.y
		)} }`;
		document.getElementById("velocity").innerText = `{ x: ${this.velocity.x.toFixed(
			2
		)}, y: ${this.velocity.y.toFixed(2)} }`;
	}

	drawHealth() {
		let hp = invlerp(this.stats.health.min, this.stats.health.max, this.stats.health.current);
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
		this.sprite.draw(player_x - offsetX, player_y - offsetY);
		// this.c.rect(player_x, player_y, this.width, this.height);
		this.c.stroke();
		this.c.closePath();
		this.drawHealth();
	}

	poisonHandler() {
		// const tile = this.collision.getTile(this.pos.x, this.pos.y, false);
		// if (tile !== 0 && tile.state.toxic.is) {
		// 	this.stats.poison.poisoned = true;
		// }

		if (this.stats.poison.poisoned && this.totalDelta >= this.stats.poison.interval) {
			//* player is poisoned and enough time has passed
			this.poisonDamage();
			this.stats.poison.current++;
			if (this.stats.poison.current >= this.stats.poison.duration) {
				//* poision duration ended
				this.stats.poison.poisoned = false;
				this.stats.poison.current = 1;
			}
			this.totalDelta = this.delta;
		}
	}

	update(delta, shop) {
		this.delta = delta;
		this.lastDraw += delta;
		this.totalDelta += delta;

		this._move(shop);
		this.poisonHandler();

		// TODO: figure out whats making player 'jumpy'
		if (this.lastDraw >= 0.25) this.drawStats();
		if (this.lastDraw >= 0.5) {
			this.status = this.sprite.updateFrames(
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

		this.inventory.updateUI(this.stats);
		// ! world.render handles drawing
	}

	init(grid) {
		this.attachKeyListener(socket);
		this.inventory.init(this.stats);
		this.collision.init(grid);
	}
}
