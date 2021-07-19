export default class Inventory {
	constructor(c) {
		this.c = c;
		this.ores = {
			copper: [],
			// silver: 0,
			// gold: 0,
		};
		this.oreValues = {
			copper: 50,
		};
		this.money = 0;
		this.isVisible = true;
	}

	init() {
		Object.keys(this.ores).forEach((key) => {
			const btn = document.getElementsByClassName(key + "-sell")[0];
			btn.addEventListener("click", this.sell.bind(this, key));
		});
		const exitBtn = document.getElementById("inventory-exit");
		exitBtn.addEventListener("click", (e) => {
			e.preventDefault();
			this.hide();
		});
	}

	sell(ore) {
		if (this.ores[ore].length === 0) return;
		this.money += this.oreValues[ore];
		this.ores[ore].length -= 1;
		console.log(this.money);
	}

	async add(ore) {
		await this.ores[ore].push(1);
	}

	drawMoney() {
		this.c.beginPath();
		this.c.strokeStyle = "#000";
		this.c.fillStyle = "#000";
		this.c.font = "25px Arial";
		this.c.fillText("$" + this.money, this.c.canvas.width - 100, 30);
	}
	show() {
		document.getElementById("inventory").setAttribute("class", "inventory-open");
		this.isVisible = true;
	}

	hide() {
		document.getElementById("inventory").setAttribute("class", "inventory-closed");
		this.isVisible = false;
	}

	updateUI() {
		// TODO: fix so only updates when in shop
		if (this.isVisible) {
			Object.keys(this.ores).forEach((key) => {
				const header = document.getElementsByClassName(`${key}-count`)[0];
				const value = document.getElementsByClassName(`${key}-value`)[0];
				value.innerHTML = "$ " + this.ores[key].length * this.oreValues[key];
				header.innerHTML = "x" + this.ores[key].length + ` ${key}`;
			});
		}
	}
}
