import Mine from "./player_mine";
import Collision from "../../collision/collision";
import Util from "../../collision/util";
import Vector from "../basic/Vector";

class Hitbox {
	constructor(health) {
		this.health = health;
		this.maxHP = health;
		this.minHP = 0;
	}
	fallDamage(velocity) {
		let dmg = velocity * 1.25;

		this.health -= dmg;
	}

	damageOverTime() {
		this.health -= 0.005;
	}

	damage(velocity) {
		this.health -= 5;
	}
	heal() {}
}

class Move extends Hitbox {
	constructor(c, inventory, spritesheet, speed, columns, rows, mapW, mapH, tilesize, tileFrames) {
		super(250);
		this.speed = speed;
		this.tilesize = tilesize;
		this.inventory = inventory;
		this.collision = new Collision(speed, tilesize, columns, rows, mapW, mapH);
		this.drill = new Mine(
			c,
			this.inventory,
			this.collision,
			spritesheet,
			48,
			48,
			speed,
			tilesize,
			columns,
			rows,
			mapW,
			mapH,
			tileFrames
		);
		this.reach = 10;
		this.moves = {
			keyW: (vector) => {
				this.isMoving = true;
				this.isFlying = true;
				this.facingDirection = "up";
				this.pos.y = vector.y;
			},
			keyA: (vector) => {
				this.isMoving = true;
				this.facingDirection = "left";
				this.pos.x = vector.x;
			},
			keyS: (vector) => {
				this.isMoving = true;
				this.facingDirection = "down";
				this.pos.y = vector.y;
			},
			keyD: (vector) => {
				this.isMoving = true;
				this.facingDirection = "right";
				this.pos.x = vector.x;
			},
		};
		this.canMove = true;
		this.isFlying = false;
		this.isGrounded = false;
		this.isMoving = false;
		this.isMining = false;
		this.isShopping = false;
		this.keys = {};
		this.keysElapsed = {};
		// this.jumpHeight = this.speed.y * 2;
		this.gravity = {
			initial: 1,
			velocity: 1,
			acc: 0.5,
			drag: 0.05,
		};
		console.log(this.gravity);
	}

	isPlayerGrounded() {
		let y = Util.lerp(this.pos.y, this.pos.y + this.gravity.velocity, this.delta);
		let vector = new Vector(this.pos.x, y);
		if (
			this.collision.collide_down([
				new Vector(vector.x, vector.y + this.height),
				new Vector(vector.x + this.width, vector.y + this.height),
			])
		) {
			return true;
		}
		return false;
	}

	_move(shop) {
		let new_x, new_y;

		// ? ----- Movement Section ----- ? //
		if (this.keys["KeyW"]) {
			new_y = Util.lerp(this.pos.y, this.pos.y - this.speed.y * 1.5, this.delta);
			if (new_y <= 0) return this.displayToUser(`cant move past world y limit: 0`);

			if (
				!this.collision.collide_top([new Vector(this.pos.x, new_y), new Vector(this.pos.x + this.width, new_y)])
			) {
				this.moves["keyW"](new Vector(this.pos.x, new_y));
			}
		}

		if (this.keys["KeyA"]) {
			new_x = Util.lerp(this.pos.x, this.pos.x - this.speed.x, this.delta);
			if (new_x <= 0) return this.displayToUser("cant move past world x limit: 0");
			if (shop.isPlayerWithinShop(new Vector(new_x, this.pos.y))) {
				shop.enterShop("right");
				this.isShopping = true;
				return;
			} else {
				shop.exitShop(new Vector(new_x, this.pos.y), this.width);
			}
			if (
				!this.collision.collide_left([
					new Vector(new_x, this.pos.y),
					new Vector(new_x, this.pos.y + this.height),
				])
			) {
				this.drill.sprite.frameX = 2;
				this.drill.sprite.frameY = 0;
				this.moves["keyA"](new Vector(new_x, this.pos.y));
			}
		}

		if (this.keys["KeyD"]) {
			new_x = Util.lerp(this.pos.x, this.pos.x + this.speed.x, this.delta);
			if (new_x + this.width > this.worldW)
				return this.displayToUser(`cant move past world x limit: ${this.worldW}`);

			if (shop.isPlayerWithinShop(new Vector(new_x + this.width, this.pos.y))) {
				shop.enterShop("left");
				this.isShopping = true;
				return;
			} else {
				shop.exitShop(new Vector(new_x, this.pos.y), this.width);
			}

			if (
				!this.collision.collide_right([
					new Vector(new_x + this.width, this.pos.y),
					new Vector(new_x + this.width, this.pos.y + this.height),
				])
			) {
				this.drill.sprite.frameX = 1;
				this.drill.sprite.frameY = 0;
				this.moves["keyD"](new Vector(new_x, this.pos.y));
			}
		}
		if (this.keys["KeyS"]) {
			new_y = Util.lerp(this.pos.y, this.pos.y + this.speed.y, this.delta);

			if (new_y + this.height > this.worldH)
				return this.displayToUser(`cant move past world y limit: ${this.worldH}`);
			if (
				!this.collision.collide_down([
					new Vector(this.pos.x, new_y + this.height),
					new Vector(this.pos.x + this.width, new_y + this.height),
				])
			) {
				this.drill.sprite.frameX = 3;
				this.drill.sprite.frameY = 0;
				this.moves["keyS"](new Vector(this.pos.x, new_y));
			}
		}

		// ? ----- Mining Section ----- ? //
		let canMine = true;
		if (
			(this.keys["KeyS"] && this.keys["Space"] && this.keys["KeyA"]) ||
			(this.keys["KeyD"] && this.keys["Space"] && this.keys["KeyS"])
		)
			canMine = false;

		if (this.keys["KeyD"] && this.keys["Space"] && canMine) {
			let t = this.collision.getTile(this.pos.x + this.width + this.reach, this.pos.y + this.height / 2);
			if (t?.value !== 0 && t !== undefined) {
				this.isMoving = false;
				this.isMining = true;
				this.facingDirection = "right";
				this.drill.sprite.frameY = this.drill.sprite.frameYs["right"];
				this.drill.sprite.frameX = this.drill.sprite.frame_loops["right"][0];
				this.drill.mine(t, this.delta, this.inventory.add.bind(this.inventory));
			}
		}
		if (this.keys["KeyA"] && this.keys["Space"] && canMine) {
			let t = this.collision.getTile(this.pos.x - this.reach, this.pos.y + this.height / 2);
			if (t?.value !== 0 && t !== undefined) {
				this.isMoving = false;
				this.isMining = true;
				this.facingDirection = "left";
				this.drill.sprite.frameY = this.drill.sprite.frameYs["left"];
				this.drill.sprite.frameX = this.drill.sprite.frame_loops["left"][0];
				this.drill.mine(t, this.delta, this.inventory.add.bind(this.inventory));
			}
		}
		if (this.keys["KeyS"] && this.keys["Space"] && canMine) {
			let t = this.collision.getTile(this.pos.x + this.width / 2, this.pos.y + this.height + this.reach);
			if (t?.value !== 0 && t !== undefined) {
				this.isMoving = false;
				this.isMining = true;
				this.facingDirection = t.x + t.w / 2 < this.pos.x + this.width / 2 ? "left" : "right";
				this.drill.sprite.frameY = this.drill.sprite.frameYs[`down${this.facingDirection}`];
				this.drill.sprite.frameX = this.drill.sprite.frame_loops[`down${this.facingDirection}`][0];
				this.drill.mine(t, this.delta, this.inventory.add.bind(this.inventory));
			}
		}

		// ? Gravity Section
		if (!this.isPlayerGrounded() && !this.isFlying) {
			new_y = Util.lerp(this.pos.y, this.pos.y + this.gravity.velocity, this.delta);
			this.pos.y = new_y;
			console.log(this.gravity.velocity);
			this.isGrounded = false;
			this.gravity.velocity += this.gravity.acc * this.gravity.drag;
		} else {
			this.isGrounded = true;
			if (this.gravity.velocity >= 20) {
				this.fallDamage(Math.trunc(this.gravity.velocity));
			} else {
				this.damageOverTime();
			}
			this.gravity.velocity = this.gravity.initial;
		}
	}
}

export default class PlayerMovement extends Move {
	constructor(
		c,
		inventory,
		camera,
		spritesheet,
		width,
		height,
		tilesize,
		speed,
		mapW,
		mapH,
		columns,
		rows,
		tileFrames
	) {
		super(c, inventory, spritesheet, speed, columns, rows, mapW, mapH, tilesize, tileFrames);
		this.c = c;
		this.camera = camera;
		this.width = width;
		this.height = height;

		this.tilesize = tilesize;
	}

	attachKeyListener() {
		document.addEventListener("keydown", (e) => {
			this.keys[e.code] = true;
			// if (!this.keysElapsed[e.code]) this.keysElapsed[e.code] = performance.now();
			// else document.getElementById("timevalue").innerText = 0;
			// document.getElementById("btnvalue").innerText = e.code;
		});
		document.addEventListener("keyup", (e) => {
			this.keys[e.code] = false;
			let timeElapsed = performance.now() - this.keysElapsed[e.code];
			delete this.keysElapsed[e.code];

			if (!this.keys["keyW"]) this.isFlying = false;

			if (!this.keys["keyW"] || !this.keys["keyA"] || !this.keys["keyS"] || !this.keys["keyD"])
				this.isMoving = false;

			if (
				(!this.keys["keyA"] && !this.keys["Space"]) ||
				(!this.keys["keyS"] && !this.keys["Space"]) ||
				(!this.keys["keyD"] && !this.keys["Space"])
			)
				this.isMining = false;

			// document.getElementById("timevalue").innerText = `${(timeElapsed / 1000).toFixed(2)}`;
		});
	}
}