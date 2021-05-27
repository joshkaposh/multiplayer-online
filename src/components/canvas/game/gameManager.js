import Player from "./game-objects/player/player";
import EnemyController from "./game-objects/enemy/enemyController";
import Camera from "./render/camera";
import World from "./map/world";

export class TurnManager {
	constructor(socket) {
		this.socket = socket;
		this.turn = 0;
		this.turnStatus = "";
	}

	emitPlayerMoveToServer(dir, playerName) {
		this.socket.emit("direction", { username: playerName, direction: dir });
	}

	startTurn(player) {
		player.status = "startOfTurn";
		this.turnStatus = "startOfTurn";
	}

	endTurn(playerName, dir) {
		this.turnStatus = "endOfTurn";
		this.turn++;
		// this.emitPlayerMoveToServer(playerName, dir);
	}
	reset() {
		this.turn = 0;
	}
}

export default class GameManager {
	constructor(
		socket,
		c,
		playerName,
		{ data: map, rows, columns, tilesize, mapW, mapH }
	) {
		this.socket = socket;
		this.c = c;
		this.enemies = [];
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		// this.map_editor = new MapEditor(this.c);
		this.manager = new TurnManager(this.socket);
		this.camera = new Camera(
			this.c,
			tilesize,
			0,
			0,
			tilesize * 5,
			tilesize * 5,
			mapW,
			mapH
		);
		const player = new Player(
			playerName,
			this.c,
			this.camera,
			0,
			0,
			tilesize,
			{ x: tilesize, y: tilesize },
			tilesize,
			tilesize,
			"grey"
		);

		this.world = new World(
			this.c,
			this.camera,
			{ data: map, rows, columns, tilesize, mapW, mapH },
			player
		);
		this.enemyController = new EnemyController(this.c, this.grid);

		this.turn = 0;
	}

	init() {
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		this.world.init();
	}

	start() {
		this.manager.reset();
		this.manager.startTurn(this.player);
	}

	update() {
		this.c.imageSmoothingEnabled = false;
		// this.enemies.forEach((enemy) => enemy.update());
		this.world.render(this.player);
		// this.enemyController.update(this.player[0]);
		// this.map_editor.update();
	}
}
