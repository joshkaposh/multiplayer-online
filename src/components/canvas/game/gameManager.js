import Player from "./game-objects/player/player";
import Camera from "./render/camera";
import World from "./map/world";
import Vector from "./game-objects/basic/Vector";

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
	constructor(socket, c, playerName, { data: map, rows, columns, tilesize, mapW, mapH }) {
		this.socket = socket;
		this.c = c;
		this.enemies = [];
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		const playerWidth = (tilesize / 8) * 4;
		const playerHeight = (tilesize / 8) * 6;
		const playerPosition = new Vector(mapW / 2, tilesize * 3 - playerHeight);
		const cameraPosition = new Vector(mapW / 2, 0);
		const camera = new Camera(
			this.c,
			cameraPosition,
			c.canvas.width,
			c.canvas.height,
			tilesize,
			columns,
			rows,
			mapW,
			mapH
		);
		const player = new Player(
			playerName,
			this.c,
			camera,
			playerPosition,
			tilesize,
			new Vector(8, 8),
			playerWidth,
			playerHeight,
			mapW,
			mapH,
			columns,
			rows,
			"grey"
		);
		this.world = new World(this.c, camera, { data: map, rows, columns, tilesize, mapW, mapH }, player);
		this.turn = 0;
	}

	init() {
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		this.world.init();
	}

	update(delta) {
		this.c.imageSmoothingEnabled = false;
		this.world.render(delta, [this.player]);
	}
}
