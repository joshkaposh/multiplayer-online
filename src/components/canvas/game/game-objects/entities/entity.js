import Vector from "../basic/Vector";
import Gravity from "../../physics/gravity";

class EntityMovement {
	constructor(pos, width, height, speed, tilesize) {
		this.pos = new Vector(pos.x, pos.y);
		this.width = width;
		this.height = height;
		this.speed = new Vector(speed.x, speed.y);
		this.tilesize = tilesize;
		this.movement_set = {
			up: (vector) => {
				this.pos.y = vector.y;
			},
			right: (vector) => {
				this.pos.x = vector.x;
			},
			left: (vector) => {
				this.pos.x = vector.x;
			},
			down: (vector) => {
				this.pos.y = vector.y;
			},
		};
		this.gravity = new Gravity(1, 1, 0.5, 0.05);
	}
}

export default class Entity extends EntityMovement {
	constructor(health, pos, width, height, speed, tilesize) {
		super(pos, width, height, speed, tilesize);
		this.stats = {
			health: {
				current: health,
				min: 0,
				max: health,
			},
		};
		this.isAlive = true;
	}

	heal(hp) {
		if (this.stats.health.current + hp > this.stats.health.max) {
			this.stats.health.current = this.stats.health.max;
		} else {
			this.stats.health.current += hp;
		}
	}

	damage(dmg) {
		if (this.stats.health.current - dmg <= this.stats.health.min) {
			this.isAlive = false;
			this.stats.health.current = 0;
		} else {
			this.stats.health.current -= dmg;
		}
	}
}
