import Player from "./game-objects/player/player";
import Camera from "./render/camera";
import World from "./map/world";
import Vector from "./game-objects/basic/Vector";
import { frames } from "./frames/frames.json";

class PlayerSpawnSystem {
	constructor(stats) {
		this.player_stats = stats;
	}
	setInitialStats(stats) {}

	initialStats() {
		const height = this.tilesize - this.tilesize / 5;
		return {
			width: this.tilesize / 3,
			height,
			position: new Vector(this.mapW / 4, this.tilesize * 3 - height),
		};
	}

	spawnPlayer({
		playerName,
		c,
		camera,
		playerPosition,
		tilesize,
		speed,
		width,
		height,
		mapW,
		mapH,
		columns,
		rows,
		frames,
		color,
	}) {
		return new Player(
			playerName,
			c,
			camera,
			playerPosition,
			tilesize,
			speed,
			width,
			height,
			mapW,
			mapH,
			columns,
			rows,
			frames,
			color
		);
	}
}

export default class GameManager extends PlayerSpawnSystem {
	constructor(socket, c, playerName, { data: map, rows, columns, tilesize, mapW, mapH, frames }) {
		super();
		this.socket = socket;
		this.c = c;
		this.enemies = [];
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.frames = frames;
		const playerWidth = tilesize / 3;
		const playerHeight = tilesize - tilesize / 5;
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
		const player = this.spawnPlayer({
			playerName,
			c,
			camera,
			playerPosition,
			tilesize,
			speed: new Vector(10, 10),
			width: playerWidth,
			height: playerHeight,
			mapW,
			mapH,
			columns,
			rows,
			frames,
			color: "grey",
		});

		this.world = new World(this.c, camera, { data: map, rows, columns, tilesize, mapW, mapH }, player);
		this.turn = 0;
	}

	init() {
		this.c.canvas.width = 600;
		this.c.canvas.height = 400;
		const canvas = document.getElementById("canvas");
		canvas.style.position = "absolute";

		this.frames = frames;

		this.world.init();
	}

	update(delta, totalDelta) {
		this.c.imageSmoothingEnabled = false;
		this.world.update(delta, totalDelta);
	}
}
