// import Vector from "../basic/Vector";
import { collision } from "../../collision/util";

export default class Enemy {
	constructor(c, pos, width, height, detectionRadius, speed, color) {
		this.c = c;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.color = color;
		this.detectionRadius = detectionRadius;
		this.isAggravated = false;
		this.attackArc = null;
	}

	drawAttackPath(x, y) {
		this.c.beginPath();
		this.c.strokeStyle = "blue";
		this.c.arc(this.attackArc.pos.x, this.attackArc.pos.y, this.attackArc.radius, 0, 2 * Math.PI, false);
		this.c.stroke();
	}

	drawRadius(x, y) {
		this.c.beginPath();
		this.c.strokeStyle = this.isAggravated === true ? "red" : "green";
		this.c.arc(x, y, this.detectionRadius, 0, 2 * Math.PI, false);
		this.c.stroke();
	}

	draw(x, y) {
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.rect(x, y, this.width, this.height);
		this.c.fill();
		this.drawRadius(x + this.width / 2, y + this.height / 2);
		if (this.attackArc) {
			this.drawAttackPath(x, y);
		}
	}

	setAttackPath(player) {
		// let { dist, distX, distY } = getDistance(player.pos, this.pos);
		// let circleX = this.pos.x - ;
		// let circleY = this.pos.y - dist / 2;
		// let pos = new Vector(circleX, circleY);
		// this.attackArc = {
		// pos,
		// radius: dist,
		// };
	}

	cancelAttack() {
		this.attackArc = null;
	}

	update(player) {
		let collide = collision.circleRect(
			this.pos.x,
			this.pos.y,
			this.detectionRadius,
			player.pos.x,
			player.pos.y,
			player.width,
			player.height
		);
		if (collide) {
			this.isAggravated = true;
			// this.setAttackPath(player);
		} else {
			this.isAggravated = false;
			this.cancelAttack(player);
		}
	}
}
