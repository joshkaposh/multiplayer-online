import PlayerSprite from "./player_sprite";
import Util from "../../collision/util";

class TileConverter {
	constructor(tileFrames) {
		this.tileFrames = tileFrames;
	}
	convertToCorner({
		current,
		top,
		behind_left,
		left,
		right,
		bottom,
		bottom_right,
		bottom_left,
		above_top,
		top_right,
		top_left,
	}) {
		let frame;
		switch (top.type) {
			case "grass":
				frame = this.tileFrames.grass.corners.both_under;
				top.frameX = frame.col;
				top.frameY = frame.row;
				top.type = "grass_both_under";

				break;
			case "grass_corner_right":
				frame = this.tileFrames.grass.corners.both_right;
				top.frameX = frame.col;
				top.frameY = frame.row;
				top.type = "grass_both_right";
				break;
			case "grass_corner_left":
				frame = this.tileFrames.grass.corners.both_left;
				top.frameX = frame.col;
				top.frameY = frame.row;
				top.type = "grass_both_left";
				break;
			case "dirt":
				if (top_left.type === "mined" && top_right.type !== "mined" && above_top !== "mined") {
					frame = this.tileFrames.dirt.corners.bottom_left;
					top.frameX = frame.col;
					top.frameY = frame.row;
					top.type = "dirt_corner_bottom_left";
				}
				break;
			case "dirt_corner_top_right":
				if (
					above_top.type === "mined" &&
					top_right.type === "mined" &&
					top_left.type !== "mined" &&
					left.type !== "mined"
				) {
					frame = this.tileFrames.dirt.corners.top_right;
					top.frameX = frame.col;
					top.frameY = frame.row;
				}

				break;
			case "dirt_corner_top_left":
				if (
					above_top.type === "mined" &&
					top_right.type !== "mined" &&
					top_left.type === "mined" &&
					right.type !== "mined"
				) {
					frame = this.tileFrames.dirt.corners.top_left;
					top.frameX = frame.col;
					top.frameY = frame.row;
				}
				break;

			default:
				break;
		}

		switch (left.type) {
			case "grass":
				frame = this.tileFrames.grass.corners.top_right;
				left.frameX = frame.col;
				left.frameY = frame.row;
				left.value = 1;
				left.type = "grass_corner_right";
				break;

			case "dirt":
				frame = this.tileFrames.dirt.corners.top_right;
				if (top.type === "mined" && top_left.type === "mined" && left.type !== "mined") {
					// top-right corner
					left.frameX = frame.col;
					left.frameY = frame.row;
					left.type = "dirt_corner_top_right";
					left.value = 3;
				}
				break;

			default:
				break;
		}

		switch (right.type) {
			case "grass_both_right":
				frame = this.tileFrames.grass.corners.all;
				right.frameX = frame.col;
				right.frameY = frame.row;
				right.frameY = frame.row;
				right.value = 5;
				right.type = "grass_all";
				break;
			case "grass_both_under":
				frame = this.tileFrames.grass.corners.grass_both_left;
				right.frameX = frame.col;
				right.frameY = frame.row;
				right.frameY = frame.row;
				right.value = 1;
				right.type = "grass_both_left";

				break;
			case "grass":
				frame = this.tileFrames.grass.corners.top_left;
				right.frameX = frame.col;
				right.frameY = frame.row;
				right.value = 1;
				right.type = "grass_corner_left";
				break;
			case "dirt":
				if (
					top.type === "mined" &&
					top_right.type === "mined" &&
					right.type !== "mined" &&
					bottom_right.type !== "mined"
				) {
					frame = this.tileFrames.dirt.corners.top_left;
					right.frameX = frame.col;
					right.frameY = frame.row;
					right.value = 3;
					right.type = "dirt_corner_top_left";
				}

				break;
			default:
				break;
		}

		// Bottom
		switch (bottom.type) {
			case "dirt":
				// checks if should be top
				if (
					right.type === "mined" &&
					bottom_right.type === "mined" &&
					bottom_left.type !== "mined" &&
					left.type !== "mined"
				) {
					frame = this.tileFrames.dirt.corners.top_right;
					bottom.frameX = frame.col;
					bottom.frameY = frame.row;
					bottom.type = "dirt_corner_top_right";
					bottom.value = 3;
				}
				if (
					left.type === "mined" &&
					bottom_left.type === "mined" &&
					bottom_right.type !== "mined" &&
					right.type !== "mined"
				) {
					frame = this.tileFrames.dirt.corners.top_left;

					bottom.frameX = frame.col;
					bottom.frameY = frame.row;
					bottom.type = "dirt_corner_top_left";
					bottom.value = 3;
				}
				break;

			default:
				break;
		}
	}

	convertToEdge({ current, top, left, right, bottom, bottom_right, bottom_left }) {
		let frame;
		if (right.type === "dirt") {
			frame = this.tileFrames.dirt.edges.left;
			right.frameX = frame.col;
			right.frameY = frame.row;
		}
		if (left.type === "dirt") {
			frame = this.tileFrames.dirt.edges.right;
			left.frameX = frame.col;
			left.frameY = frame.row;
		}
		if (bottom.type === "dirt") {
			frame = this.tileFrames.dirt.edges.top;
			bottom.frameX = frame.col;
			bottom.frameY = frame.row;
		}
	}
	switchSurroundingTileValues(surroundings) {
		// let values = Object.values(surroundings);

		this.convertToCorner(surroundings);
		this.convertToEdge(surroundings);
	}
}

export default class Mine extends TileConverter {
	constructor(
		c,
		inventory,
		collision,
		spritesheet,
		width,
		height,
		speed,
		tilesize,
		columns,
		rows,
		mapW,
		mapH,
		tileFrames
	) {
		super(tileFrames);
		this.inventory = inventory;
		this.collision = collision;
		this.speed = speed;
		this.tilesize = tilesize;
		this.columns = columns;
		this.rows = rows;
		this.mapW = mapW;
		this.mapH = mapH;
		this.count = 0;
		this.totalCount = 0;
		this.drill_speed = 5;
		this.sprite = new PlayerSprite(c, spritesheet, width, height, 2, 2);
		this.mined = null;
	}

	getSurroundingTiles(tile) {
		return {
			current: tile,
			behind_left: this.collision.getTile(tile.column - 1, tile.row, true),
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

	checkIntegrityLevel({ integrity, integPercents: percents }) {
		/* change tile sprites as they break */
		if (integrity < percents[25]) return 3;
		if (integrity < percents[50]) return 2;
		if (integrity < percents[75]) return 1;
		if (integrity > percents[75]) return 0;
	}

	changeTileToBreaking(tile) {
		if (tile.type === "grass") return this.tileFrames.grass.breaking.default[0].row;
		if (tile.type === "grass_corner_right") return this.tileFrames.grass.breaking.top_right[0].row;
		if (tile.type === "grass_corner_left") return this.tileFrames.grass.breaking.top_left[0].row;
		if (tile.type === "grass_corners_both") return this.tileFrames.grass.breaking.both_corners[0].row;
		if (
			tile.type === "dirt" ||
			tile.type === "dirt_corner_top_left" ||
			tile.type === "dirt_corner_top_right" ||
			tile.type === "dirt_corner_bottom_left" ||
			tile.type === "dirt_corner_bottom_right"
		)
			return this.tileFrames.dirt.breaking[0].row;
		if (tile.type === "copper") return this.tileFrames.ores.copper.breaking[0].row;
		if (tile.type === "iron") return this.tileFrames.ores.iron.breaking[0].row;
	}

	async mine(tile, delta, cb) {
		let new_integrity = Util.lerp(tile.integrity, tile.integrity - this.drill_speed, delta);

		if (
			tile.value === this.tileFrames.walkables[0] ||
			tile.value === this.tileFrames.walkables[1] ||
			tile.integrity === 0 ||
			tile.type === "mined"
		)
			return;
		// if tile is walkable, return early

		tile.frameY = this.changeTileToBreaking(tile);
		tile.frameX = this.checkIntegrityLevel(tile);
		// update sprite

		if (new_integrity <= 0) {
			// mined
			tile.frameY = 0;
			if (tile.type === "grass" || tile.type === "grass_corner_left" || tile.type === "grass_corner_right") {
				tile.frameX = 1;
			} else tile.frameX = 2;

			switch (tile.type) {
				case "copper":
					// console.log("mined copper ore");
					await cb("copper");
					break;
				case "iron":
					// console.log("mined iron ore");
					await cb("iron");
					break;
				default:
					break;
			}

			const tileTypes = Object.keys(this.tileFrames);
			console.log(tileTypes);

			this.mined = tile.type;

			tile.type = "mined";
			tile.integrity = 0;
			tile.value = 0;
			this.switchSurroundingTileValues(this.getSurroundingTiles(tile));
			return;
		}
		tile.integrity = new_integrity;
	}
}
