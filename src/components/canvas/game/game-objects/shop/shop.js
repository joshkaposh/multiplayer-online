export default class Shop {
	constructor(c, pos, width, height, tilesize, color) {
		this.c = c;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.boundary = {
			x: pos.x - tilesize,
			y: pos.y + height,
			width: width + tilesize * 2,
			height: tilesize / 2,
		};
		this.color = color;
		this.tilesize = tilesize;
		this.isVisible = false;
	}

	isPlayerWithinShop(vector) {
		if (
			vector.x >= this.pos.x &&
			vector.x <= this.pos.x + this.width &&
			vector.y >= this.pos.y &&
			vector.y <= this.pos.y + this.height
		) {
			return true;
		}
		return false;
	}

	open() {
		const inventory = document.getElementById("inventory");
		inventory.setAttribute("class", "inventory-open");
	}

	closed() {
		const inventory = document.getElementById("inventory");
		inventory.setAttribute("class", "inventory-closed");
	}

	isTileWithinBoundary(tile) {
		let { xMin, yMin, xMax, yMax } = this.getBoundary();
		if (tile.x >= xMin && tile.x <= xMax && tile.y >= yMin && tile.y <= yMax) {
			return true;
		}
		return false;
	}

	getBoundary() {
		return {
			xMin: this.boundary.x,
			yMin: this.boundary.y,
			xMax: this.boundary.x + this.boundary.width,
			yMax: this.boundary.y + this.boundary.height,
		};
	}

	draw(camera) {
		let shop_x = this.pos.x - camera.pos.x;
		let shop_y = this.pos.y - camera.pos.y;
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		this.c.fillRect(shop_x, shop_y, this.width, this.height);

		// this.c.fillRect(boundary_x, boundary_y, boundaryWidth, boundaryHeight);
		this.c.closePath();
	}
	update(camera) {
		this.draw(camera);
	}
}
