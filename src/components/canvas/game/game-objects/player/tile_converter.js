export default class TileConverter {
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
				right.value = 5;
				right.type = "grass_all";
				break;
			case "grass_both_under":
				frame = this.tileFrames.grass.corners.grass_both_left;
				right.frameX = frame.col;
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
		if (bottom) {
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
	}

	convertToEdge({
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

		if (top !== 0 && top.type !== "mined") {
			console.log(top);

			if (
				top_left !== 0 &&
				top_left.type !== "mined" &&
				top_right !== 0 &&
				top_right.type !== "mined" &&
				above_top !== 0 &&
				above_top !== "mined"
			) {
				frame = this.tileFrames.dirt.edges.bottom;
				top.frameX = frame.col;
				top.frameY = frame.row;
			}
		}

		if (right !== 0 && right.type !== "mined" && right.type.slice(0, 5) !== "grass") {
			frame = this.tileFrames.dirt.edges.left;
			console.log(right.type);
			right.frameX = frame.col;
			right.frameY = frame.row;
		}
		if (left !== 0 && left.type !== "mined" && right.type.slice(0, 5) !== "grass") {
			frame = this.tileFrames.dirt.edges.right;
			left.frameX = frame.col;
			left.frameY = frame.row;
		}
		if (bottom !== 0 && bottom.type !== "mined" && bottom.type.slice(0, 5) !== "grass") {
			frame = this.tileFrames.dirt.edges.top;
			bottom.frameX = frame.col;
			bottom.frameY = frame.row;
		}
	}

	switchSurroundingTileValues(surroundings) {
		// let values = Object.values(surroundings);

		this.convertToEdge(surroundings);
		this.convertToCorner(surroundings);
	}
}
