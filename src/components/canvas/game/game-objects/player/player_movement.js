import Util from "../../collision/util";
import Vector from "../basic/Vector";
import PlayerEntity from "./player_entity";

class Move extends PlayerEntity {
	constructor(health, pos, width, height, speed, columns, rows, mapW, mapH, tilesize, tileFrames) {
		super(health, pos, width, height, speed, tilesize, columns, rows, mapW, mapH, tileFrames, tileFrames.ores);
		this.speed = speed;
		this.tilesize = tilesize;
		this.velocity = new Vector(0, 0);
		this.reach = 10;
		this.canMove = true;
		this.isFlying = false;
		this.isFalling = false;
		this.isGrounded = false;
		this.isMoving = false;
		this.isMining = false;
		this.isShopping = false;
		this.keys = {};
		this.keysElapsed = {};
		this.jumpHeight = this.speed.y * 1.5;
	}

	preventDoubleMining() {
		if (
			(this.keys["KeyS"] && this.keys["Space"] && this.keys["KeyA"]) ||
			(this.keys["KeyD"] && this.keys["Space"] && this.keys["KeyS"])
		)
			return false;
		else return true;
	}

	isPlayerAboutToHitGround() {
		const ACC = this.gravity.acc * this.gravity.drag;
		const gravityPlusOneFrame = this.gravity.velocity * ACC;
		const SCANHEIGHT = this.height / 2;

		let y = Util.lerp(this.pos.y, this.pos.y + gravityPlusOneFrame, this.delta);
		let vector = new Vector(this.pos.x, y);

		if (
			this.collision.collide_down([
				new Vector(vector.x, vector.y + this.height + SCANHEIGHT),
				new Vector(vector.x + this.width, vector.y + this.height + SCANHEIGHT),
			])
		) {
			return true;
		}
		return false;
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

	handleFallDamage(velocity) {
		if (velocity.y >= this.fallingMinVelocity && !this.isFlying) {
			this.fallDamage(velocity.y);
		}
	}

	jump(trackedMoves) {
		let pos, velocity;
		let y = Util.lerp(this.pos.y, this.pos.y - this.jumpHeight, this.delta);
		pos = new Vector(this.pos.x, y);

		if (y <= 0) return this.displayToUser(`cant move past world y limit: 0`);

		if (!this.collision.collide_top([pos, new Vector(pos.x + this.width, pos.y)])) {
			velocity = new Vector(0, pos.y - this.pos.y);
			this.isMoving = true;
			this.isFlying = true;
			this.movement_set["up"](pos);
			trackedMoves.push(velocity);
		}
	}

	moveLeft(trackedMoves, shop) {
		let pos, velocity;
		let x = Util.lerp(this.pos.x, this.pos.x - this.speed.x, this.delta);
		pos = new Vector(x, this.pos.y);

		if (x <= 0) return this.displayToUser("cant move past world x limit: 0");
		if (shop.isPlayerWithinShop(pos)) {
			shop.open();
			this.isShopping = true;
			return;
		} else {
			shop.closed();
			this.isShopping = false;
		}
		if (!this.collision.collide_left([pos, new Vector(pos.x, pos.y + this.height)])) {
			velocity = new Vector(pos.x - this.pos.x, 0);
			this.isMoving = true;
			this.facingDirection.facing = "left";
			this.movement_set["left"](pos);
			trackedMoves.push(velocity);
		}
	}

	moveRight(trackedMoves, shop) {
		let pos, velocity;
		let x = Util.lerp(this.pos.x, this.pos.x + this.speed.x, this.delta);
		pos = new Vector(x, this.pos.y);
		if (x + this.width > this.worldW) return this.displayToUser(`cant move past world x limit: ${this.worldW}`);

		if (shop.isPlayerWithinShop(new Vector(pos.x + this.width, pos.y))) {
			shop.open();
			this.isShopping = true;
			return;
		} else {
			shop.closed();
			this.isShopping = false;
		}

		if (
			!this.collision.collide_right([
				new Vector(pos.x + this.width, pos.y),
				new Vector(pos.x + this.width, pos.y + this.height),
			])
		) {
			velocity = new Vector(pos.x - this.pos.x, 0);
			this.isMoving = true;
			this.facingDirection.facing = "right";
			this.movement_set["right"](pos);
			trackedMoves.push(velocity);
		}
	}

	moveDown(trackedMoves, shop) {
		let pos, velocity;
		let y = Util.lerp(this.pos.y, this.pos.y + this.speed.y, this.delta);
		pos = new Vector(this.pos.x, y);
		if (y + this.height > this.worldH) return this.displayToUser(`cant move past world y limit: ${this.worldH}`);
		if (shop.isPlayerWithinShop(pos)) {
			shop.open();
			this.isShopping = true;
			return;
		} else {
			shop.closed();
			this.isShopping = false;
		}
		if (
			!this.collision.collide_down([
				new Vector(pos.x, pos.y + this.height),
				new Vector(pos.x + this.width, pos.y + this.height),
			])
		) {
			velocity = new Vector(0, pos.y - this.pos.y);
			this.isMoving = true;
			this.movement_set["down"](pos);
			trackedMoves.push(velocity);
		}
	}

	mineLeft(shop) {
		let t = this.collision.getTile(this.pos.x - this.reach, this.pos.y + this.height / 2);
		if (t?.value !== 0 && t !== 0 && t !== undefined && !shop.isTileWithinBoundary(t) && this.isGrounded) {
			this.isMoving = false;
			this.isMining = true;
			this.facingDirection.facing = "left";
			this.drill.mine(
				t,
				this.stats.mining_speed.current,
				this.inventory.add.bind(this.inventory),
				this,
				this.delta
			);
		} else {
			this.facingDirection.down = false;
		}
	}

	mineRight(shop) {
		let t = this.collision.getTile(this.pos.x + this.width + this.reach, this.pos.y + this.height / 2);
		if (t?.value !== 0 && t !== 0 && t !== undefined && !shop.isTileWithinBoundary(t) && this.isGrounded) {
			this.isMoving = false;
			this.isMining = true;
			this.facingDirection.facing = "right";
			this.drill.mine(
				t,
				this.stats.mining_speed.current,
				this.inventory.add.bind(this.inventory),
				this,
				this.delta
			);
		} else {
			this.facingDirection.down = false;
		}
	}

	mineDown(shop) {
		let t = this.collision.getTile(this.pos.x + this.width / 2, this.pos.y + this.height + this.reach);
		if (t?.value !== 0 && t !== 0 && t !== undefined && !shop.isTileWithinBoundary(t) && this.isGrounded) {
			this.isMoving = false;
			this.isMining = true;
			this.facingDirection.facing = t.x + t.w / 2 < this.pos.x + this.width / 2 ? "left" : "right";
			this.facingDirection.down = true;
			this.drill.mine(
				t,
				this.stats.mining_speed.current,
				this.inventory.add.bind(this.inventory),
				this,
				this.delta
			);
		} else {
			this.facingDirection.down = false;
		}
	}
}

class ActionHandlers extends Move {
	constructor(health, pos, width, height, speed, columns, rows, mapW, mapH, tilesize, tileFrames) {
		super(health, pos, width, height, speed, columns, rows, mapW, mapH, tilesize, tileFrames);
	}
	miningHandler(shop) {
		// ? ----- Mining Section ----- ? //
		let canMine = this.preventDoubleMining();

		if (this.keys["KeyA"] && this.keys["Space"] && canMine) {
			this.mineLeft(shop);
		}
		if (this.keys["KeyD"] && this.keys["Space"] && canMine) {
			this.mineRight(shop);
		}
		if (this.keys["KeyS"] && this.keys["Space"] && canMine) {
			this.mineDown(shop);
		}
	}

	gravityHandler(totalVelocity) {
		// ? Gravity Section
		// if (this.isPlayerAboutToHitGround() && !this.isPlayerGrounded() && !this.isFlying) {
		// 	// set landing frame
		// }
		let new_y, finalVelocity;

		if (!this.isPlayerGrounded() && !this.isFlying) {
			// increment gravity velocity
			new_y = Util.lerp(this.pos.y, this.pos.y + this.gravity.velocity, this.delta);
			finalVelocity = new Vector(totalVelocity.x, totalVelocity.y + new_y - this.pos.y);
			this.gravity.increment();
			this.isGrounded = false;
			this.isFalling = true;
			this.pos.y = new_y;
		} else {
			// player is grounded, reset gravity
			new_y = Util.lerp(this.pos.y, this.pos.y + this.gravity.velocity, this.delta);
			finalVelocity = new Vector(totalVelocity.x * 100, (totalVelocity.y + new_y - this.pos.y) * 100);
			this.handleFallDamage(finalVelocity);
			this.gravity.reset();
			this.isGrounded = true;
			this.isFalling = false;
		}
		return finalVelocity;
	}

	movementHandler(trackedMoves, shop) {
		// ? ----- Movement Section ----- ? //
		if (this.keys["KeyW"]) this.jump(trackedMoves);
		if (this.keys["KeyA"]) this.moveLeft(trackedMoves, shop);
		if (this.keys["KeyD"]) this.moveRight(trackedMoves, shop);
		if (this.keys["KeyS"]) this.moveDown(trackedMoves);
	}

	_move(shop) {
		let totalVelocity = new Vector(0, 0);
		const trackedMoves = [];

		this.movementHandler(trackedMoves, shop);
		this.miningHandler(shop);

		if (trackedMoves.length !== 0) {
			for (let i = 0; i < trackedMoves.length; i++) {
				totalVelocity.add(trackedMoves[i]);
			}
		}

		this.velocity = this.gravityHandler(totalVelocity);
	}
}

export default class InitKeyListeners extends ActionHandlers {
	constructor(c, camera, health, pos, width, height, speed, tilesize, mapW, mapH, columns, rows, tileFrames) {
		super(health, pos, width, height, speed, columns, rows, mapW, mapH, tilesize, tileFrames);
		this.c = c;
		this.camera = camera;
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
			// let timeElapsed = performance.now() - this.keysElapsed[e.code];
			// delete this.keysElapsed[e.code];
			if (!this.keys["keyW"]) this.isFlying = false;

			if (!this.keys["keyW"] || !this.keys["keyA"] || !this.keys["keyS"] || !this.keys["keyD"])
				this.isMoving = false;

			if (
				(!this.keys["keyA"] && !this.keys["Space"]) ||
				(!this.keys["keyS"] && !this.keys["Space"]) ||
				(!this.keys["keyD"] && !this.keys["Space"])
			) {
				this.facingDirection.down = false;
				this.isMining = false;
			}
		});
	}
}
