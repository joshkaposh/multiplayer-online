import Player from "./game-objects/player/player";
import Camera from "./render/camera";
import World from "./map/world";
import Vector from "./game-objects/basic/Vector";
import { frames } from "./frames/frames.json";

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
	constructor(socket, c, playerName, { data: map, rows, columns, tilesize, mapW, mapH, frames }) {
		this.socket = socket;
		this.c = c;
		this.enemies = [];
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.frames = frames;
		const playerWidth = (tilesize / 8) * 4;
		const playerHeight = (tilesize / 8) * 6;
		const playerPosition = new Vector(mapW / 4, tilesize * 3 - playerHeight);
		const cameraPosition = new Vector(playerPosition.x, 0);
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
			new Vector(10, 10),
			playerWidth,
			playerHeight,
			mapW,
			mapH,
			columns,
			rows,
			frames,
			"grey"
		);
		this.world = new World(this.c, camera, { data: map, rows, columns, tilesize, mapW, mapH }, player);
		this.turn = 0;
	}

	init() {
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		const canvas = document.getElementById("canvas");
		canvas.style.position = "absolute";

		console.log(this.frames);
		frames = this.frames;
		// canvas.style.left = window.innerWidth / 2 - this.c.canvas.width / 2;
		// canvas.style.top = window.innerHeight / 2 - this.c.canvas.height / 2;

		this.world.init();
	}

	update(delta) {
		this.c.imageSmoothingEnabled = false;
		this.world.render(delta, [this.player]);
	}
}
