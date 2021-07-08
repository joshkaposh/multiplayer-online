import frames from "../../frames/frames";
import Drill from "./player_drill";
import Util from "../../collision/util";
export default class Mine {
	constructor(c, collision, spritesheet, width, height, speed, tilesize, columns, rows, mapW, mapH) {
		this.collision = collision;
		this.speed = speed;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.mapW = mapW;
		this.mapH = mapH;
		this.count = 0;
		this.drill_speed = 5;
		this.sprite = new Drill(c, spritesheet, width, height, 2);
	}

	getSurroundingTiles(tile) {
		return {
			current: tile,
			left: this.collision.getTile(tile.column - 1, tile.row, true),
			right: this.collision.getTile(tile.column + 1, tile.row, true),
			top: this.collision.getTile(tile.column, tile.row - 1, true),
			above_top: this.collision.getTile(tile.column, tile.row - 2, true),
			top_left: this.collision.getTile(tile.column - 1, tile.row - 1, true),
			top_right: this.collision.getTile(tile.column + 1, tile.row - 1, true),
			bottom: this.collision.getTile(tile.column, tile.row + 1, true),
			bottom_left: this.collision.getTile(tile.column - 1, tile.row + 1, true),
			bottom_right: this.collision.getTile(tile.column + 1, tile.row + 1, true),
		};
	}

	get score() {
		return this.count;
	}

	convertToEdge({ current, top, left, right, bottom, bottom_right, bottom_left }, direction) {
		switch (left.type) {
			case "grass":
				left.frameX = 1;
				left.frameY = 1;
				left.value = 1;
				left.type = "grass_corner_right";
				break;
			case "dirt":
				left.frameX = 0;
				left.frameY = 3;
				left.value = 2;
				break;
			case "hardened_dirt_topsoil":
				left.frameX = 2;
				left.frameY = 2;
				left.value = 2;
				break;
			case "hardened_dirt":
				left.frameX = 4;
				left.frameY = 3;
				left.value = 2;
				break;
			default:
				break;
		}
		switch (right.type) {
			case "grass":
				right.frameX = 2;
				right.frameY = 1;
				right.value = 1;
				right.type = "grass_corner_left";
				break;
			case "dirt":
				right.frameX = 1;
				right.frameY = 3;
				right.value = 2;
				break;

			case "hardened_dirt_topsoil":
				right.frameX = 2;
				right.frameY = 2;
				right.value = 2;
				break;
			case "hardened_dirt":
				right.frameX = 5;
				right.frameY = 3;
				right.value = 2;
				break;

			default:
				break;
		}
		switch (top.type) {
			case "dirt":
				top.frameX = 3;
				top.frameY = 3;
				top.value = 2;
				break;
			case "hardened_dirt_topsoil":
				top.frameX = 2;
				top.frameY = 2;
				top.value = 2;
				break;
			case "hardened_dirt":
				top.frameX = 7;
				top.frameY = 3;
				top.value = 2;
				break;
			default:
				break;
		}
		switch (bottom.type) {
			case "dirt":
				bottom.frameX = 2;
				bottom.frameY = 3;
				bottom.value = 2;
				break;
			case "hardened_dirt_topsoil":
				bottom.frameX = 2;
				bottom.frameY = 2;
				bottom.value = 2;
				break;
			case "hardened_dirt":
				bottom.frameX = 6;
				bottom.frameY = 3;
				bottom.value = 2;
				break;

			default:
				break;
		}
	}
	convertToCorners(
		{ current, left, right, top, above_top, bottom, top_left, top_right, bottom_left, bottom_right },
		direction
	) {
		/*
		! FUNCTION DESCRIPTION
		*
		* converts side pieces to corner pieces
		* e.g. if you mine a cross, the corners will be rounded
		*
		TODO: take mining direction into consideration
		TODO: fix bottom_right, bottom_left corner if statements
		*
		*
		*/
	}

	switchSurroundingTileValues(surroundings, direction) {
		// ? topRight: current, left, top_left, top;
		// ? topLeft: current, right, top_right, top;
		// ? bottomLeft: current, right, bottom_right, bottom;
		// ? bottomRight: current, left, bottom_left, bottom;
		this.convertToEdge(surroundings);
		// this.convertToCorners(surroundings, direction);
	}

	checkIntegrityLevel({ integrity, integPercents: percents }) {
		/* change tile sprites as they break */
		if (integrity < percents[25]) return 3;
		if (integrity < percents[50]) return 2;
		if (integrity < percents[75]) return 1;
		if (integrity < percents[100]) return 0;
	}

	changeTileToMining(tile) {
		if (tile.type === "grass") return 6;
		if (tile.type === "grass_corner_right") return 7;
		if (tile.type === "grass_corner_left") return 8;
		if (tile.type === "dirt") return 9;
		if (tile.type === "hardened_dirt_topsoil") return 10;
		if (tile.type === "hardened_dirt") return 10;
	}

	mine(tile, direction, delta) {
		let new_integrity = Util.lerp(tile.integrity, tile.integrity - this.drill_speed, delta);
		if (
			tile.value === frames.walkables[0] ||
			tile.value === frames.walkables[1] ||
			tile.integrity === 0 ||
			tile.type === "mined"
		)
			return;
		// if tile is walkable, return early
		tile.frameY = this.changeTileToMining(tile);
		tile.frameX = this.checkIntegrityLevel(tile);
		// update sprite
		if (new_integrity <= 0) {
			// mined
			tile.frameY = 0;
			if (tile.type === "grass" || tile.type === "grass_corner_left" || tile.type === "grass_corner_right") {
				tile.frameX = 1;
			} else tile.frameX = 2;

			tile.type = "mined";
			tile.integrity = 0;
			tile.value = 0;
			this.switchSurroundingTileValues(this.getSurroundingTiles(tile), direction);
			return;
		}
		tile.integrity = new_integrity;
	}
}
