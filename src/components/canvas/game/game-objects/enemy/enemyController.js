import Enemy from "./enemy";

function randomIndex(list) {
	return list[Math.floor(Math.random() * list.length)];
}

export default class EnemyController {
	constructor(c, grid, players) {
		this.c = c;
		this.grid = grid;
		this.players = players;
		this.enemies = [];
	}

	spawn(count, player) {
		for (let i = 0; i < count; i++) {
			let { x, y } = randomIndex(this.grid.lines);
			if (x === player.x && y === player.y) {
				x += 120;
				y += 120;
			}
			this.enemies.push(
				new Enemy(this.c, x, y, 60, 40, { x: 60, y: 40 }, "brown")
			);
		}
	}

	update(player) {
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(player);
		}
	}
}
