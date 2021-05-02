import Player from "./game-objects/player/player";
import EnemyController from "./game-objects/enemy/enemyController";
import MapEditor from "./mapEditor";
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
	constructor(socket, c, players) {
		this.socket = socket;
		this.c = c;
		this.players = players;
		this.enemies = [];
		this.tilesize = 64;
		this.columns = 20;
		this.rows = 20;
		// this.map_editor = new MapEditor(this.c);
		this.manager = new TurnManager(this.socket);
		this.camera = new Camera(this.c, 0, 0, 400, 200);
		this.world = new World(
			this.c,
			this.camera,
			this.tilesize,
			this.columns,
			this.rows
		);
		this.enemyController = new EnemyController(this.c, this.grid);

		this.turn = 0;
	}

	init() {
		const width = 64;
		const height = 64;
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		this.world.init();

		const player = new Player(
			this.players,
			this.manager,
			this.c,
			this.camera,
			0,
			0,
			{ x: 64, y: 64 },
			width,
			height,
			"grey"
		);
		this.player = player;
		player.init(this.socket);
		this.world.player = player;
	}

	start() {
		this.manager.reset();
		this.manager.startTurn(this.players);
	}

	update() {
		this.c.imageSmoothingEnabled = false;
		this.player.update();
		// this.enemies.forEach((enemy) => enemy.update());
		this.world.render(this.player);
		// this.enemyController.update(this.players[0]);
		// this.map_editor.update();
	}
}
