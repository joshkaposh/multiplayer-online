import TileConverter from "./tile_converter";
import Util from "../../collision/util";

export default class Mine extends TileConverter {
	constructor(inventory, collision, speed, tilesize, columns, rows, mapW, mapH, tileFrames) {
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
		this.mined = null;
	}

	get score() {
		return this.count;
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

	checkIntegrityLevel({ type, integrity, integPercents: percents }) {
		/* change tile sprites as they break */
		if (type.slice(0, 5) === "grass") {
			if (integrity < percents[25]) return 3;
			if (integrity < percents[50]) return 2;
			if (integrity < percents[75]) return 1;
			if (integrity > percents[75]) return 0;
		} else {
			if (integrity < percents[12.5]) return 7;
			if (integrity < percents[25]) return 6;
			if (integrity < percents[37.5]) return 5;
			if (integrity < percents[50]) return 4;
			if (integrity < percents[62.5]) return 3;
			if (integrity < percents[75]) return 2;
			if (integrity < percents[87.5]) return 1;
			if (integrity > percents[87.5]) return 0;
		}
	}

	changeTileToBreaking(tile) {
		if (tile.type === "grass") return this.tileFrames.grass.breaking.default[0].row;
		if (tile.type === "grass_corner_right") return this.tileFrames.grass.breaking.top_right[0].row;
		if (tile.type === "grass_corner_left") return this.tileFrames.grass.breaking.top_left[0].row;
		if (tile.type === "grass_corners_both") return this.tileFrames.grass.breaking.both_corners[0].row;
		if (tile.type.slice(0, 4) === "dirt") return this.tileFrames.dirt.breaking[0].row;
		if (tile.type === "hardened_dirt_topsoil") return this.tileFrames.hardened_dirt_topsoil.breaking[0].row;
		if (tile.type === "hardened_dirt") return this.tileFrames.hardened_dirt.breaking[0].row;
	}

	async mine(tile, speed, cb, player, delta) {
		if (tile.integrity === 0 || tile.type === "mined") return;
		// if tile is walkable, return early

		let new_integrity = Util.lerp(tile.integrity, tile.integrity - speed, delta);

		tile.frameY = this.changeTileToBreaking(tile);
		tile.frameX = this.checkIntegrityLevel(tile);
		// update sprite

		if (tile.type === "hardened_dirt_topsoil") {
			console.log(tile);
		}

		if (new_integrity <= 0) {
			// mined
			tile.frameY = 0;
			if (tile.type === "grass" || tile.type === "grass_corner_left" || tile.type === "grass_corner_right") {
				tile.frameX = 1;
			} else tile.frameX = 2;

			const { ore, toxic } = tile.state;

			if (ore.is) {
				await cb(ore.type);
			}

			if (toxic.is) {
				player.stats.poison.current = 1;
				player.stats.poison.poisoned = true;
				player.totalDelta = delta;
				// todo: start animation for toxic cloud
				// todo: create tile state function that returns state based on booleans (similar to player_sprite)
				// todo: take poison damage
				// tile.frameX = toxic.frames.start;
			}

			this.mined = ore.type || tile.type;

			tile.type = "mined";
			tile.integrity = 0;
			tile.value = 0;
			tile.walkable = true;
			this.switchSurroundingTileValues(this.getSurroundingTiles(tile));
			return;
		}

		tile.integrity = new_integrity;
	}
}
