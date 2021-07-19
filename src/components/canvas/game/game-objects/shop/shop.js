export default class Shop {
	constructor(c, pos, width, height, color) {
		this.c = c;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.color = color;
		this.enteredDirection = null;
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

	enterShop(enteredDir) {
		this.enteredDirection = enteredDir;
		const inventory = document.getElementById("inventory");
		inventory.setAttribute("class", "inventory-open");
	}

	exitShop(vector, width) {
		let exitDist = 10;
		switch (this.enteredDirection) {
			case "left":
				vector.x = this.pos.x - width - exitDist;
				break;
			case "right":
				vector.x = this.pos.x + this.width + exitDist;
				break;
			default:
				break;
		}
		const inventory = document.getElementById("inventory");
		inventory.setAttribute("class", "inventory-closed");
	}

	draw(camera) {
		let shop_x = this.pos.x - camera.pos.x;
		let shop_y = this.pos.y - camera.pos.y;
		this.c.beginPath();
		this.c.fillStyle = this.color;
		this.c.strokeStyle = this.color;
		this.c.fillRect(shop_x, shop_y, this.width, this.height);
		this.c.closePath();
	}
	update(camera) {
		this.draw(camera);
	}
}
