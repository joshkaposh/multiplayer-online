class Upgrades {
	constructor(health) {
		this.health = {
			initial: health,
			maxHP: health,
			current: health,
			inc: 100,
			costPerHP: 10,
			level: 1,
			levelInc: 250,
		};
		this.heal = {
			initial: health,
			maxHP: health,
			inc: 1,
		};
	}

	increaseMaxHealth(player, cost, money) {
		if (money >= cost) {
			player.maxHP += this.health.inc;
			this.health.maxHP = player.maxHP;
			this.health.level++;
			player.heal(this.health.inc);
			money -= cost;
			return true;
		}
		return false;
	}

	healPlayer(player, cost, money) {
		if (money !== 0) {
			const hpHealed = Math.trunc(cost / this.heal.inc);
			player.health += hpHealed;
			return true;
		}
		return false;
	}
}

export default class Inventory {
	constructor(c, health, ores) {
		// TODO: sync up health to character,
		this.c = c;
		this.ores = ores;
		this.oreValues = {
			copper: 50,
			iron: 100,
		};
		this.upgrades = new Upgrades(health);
		this.isVisible = false;
		this.reset = false;
		this.exit = false;
		this.money = 0;
	}

	// upgradeHealth(current) {

	// }
	initDeathMenu() {
		document.getElementById("retry-game").addEventListener("click", (e) => {
			// reset
			console.log("SHOULD RESET GAME");
		});
		document.getElementById("exit-game").addEventListener("click", (e) => {
			// exit
			console.log("SHOULD EXIT GAME");
		});
	}

	init(player) {
		Object.keys(this.ores).forEach((key) => {
			//! sell-section
			const btn = document.getElementById(key + "-sell");
			const sellAllBtn = document.getElementById(key + "-sell-all");
			btn.addEventListener("click", this.sell.bind(this, key));
			sellAllBtn.addEventListener("click", this.sellAll.bind(this, key));
		});

		Object.keys(this.upgrades).forEach((key) => {
			//! buy-section
			const btn = document.getElementById(`buy-${key}`);
			btn.addEventListener("click", this.buy.bind(this, key, player));
		});

		const exitBtn = document.getElementById("inventory-exit");
		exitBtn.addEventListener("click", (e) => {
			e.preventDefault();
			this.hide();
		});
		this.initDeathMenu();
	}

	buy(upgrade, player) {
		let cost, didUpgrade;
		switch (upgrade) {
			case "heal":
				cost = this.setHealCost(player.health);
				didUpgrade = this.upgrades.healPlayer(player, cost, this.money);
				break;
			case "health":
				cost = this.setHealthCost();
				didUpgrade = this.upgrades.increaseMaxHealth(player, cost, this.money);
				break;
			default:
				break;
		}
		if (didUpgrade) {
			this.money -= cost;
		}
	}

	sellAll(ore) {
		if (this.ores[ore].length === 0) return;
		let count = this.ores[ore].length;
		let gained = count * this.oreValues[ore];
		this.ores[ore].length = 0;
		this.money += gained;
		console.log(ore);
	}

	sell(ore) {
		if (this.ores[ore].length === 0) return;
		this.money += this.oreValues[ore];
		this.ores[ore].length -= 1;
		console.log(this.money);
		console.log(ore);
	}

	async add(ore) {
		await this.ores[ore].push(1);
		console.log(this.ores[ore]);
	}

	drawMoney() {
		this.c.beginPath();
		this.c.strokeStyle = "#000";
		this.c.fillStyle = "#000";
		this.c.font = "25px Arial";
		this.c.fillText("$" + this.money, this.c.canvas.width - 100, 30);
	}

	setHealthCost() {
		return (
			this.upgrades["health"].costPerHP * this.upgrades["health"].inc +
			this.upgrades["health"].levelInc * this.upgrades["health"].level
		);
	}

	setHealCost(health) {
		let currentHP = health;
		let costPerHP = this.upgrades["heal"].inc;
		let buyCount = Math.trunc(this.money / costPerHP);
		let fullHP = this.upgrades.health.maxHP;
		let missingHP = fullHP - currentHP;

		let cost = Math.trunc(missingHP * costPerHP);

		if (cost > this.money) {
			return buyCount * costPerHP;
		}
		return cost;
	}

	show() {
		document.getElementById("inventory").setAttribute("class", "inventory-open");
		this.isVisible = true;
	}

	hide() {
		document.getElementById("inventory").setAttribute("class", "inventory-closed");
		this.isVisible = false;
	}

	async updateUI(health) {
		// TODO: fix so only updates when in shop
		//! sell section //
		Object.keys(this.ores).forEach(async (key) => {
			const item = document.getElementsByClassName(`sell-list-item-${key}`)[0];
			const header = document.getElementsByClassName(`${key}-count`)[0];
			const value = document.getElementsByClassName(`${key}-value`)[0];
			// console.log(item.style.display);

			let count = await this.ores[key].length;
			if (count > 0) {
				item.style.display = "inline-flex";
				const sellbtn = document.getElementsByClassName(key + "-sell")[0];
				// console.log(sellbtn);
			} else {
				item.style.display = "none";
			}

			value.innerHTML = "$ " + count * this.oreValues[key];
			header.innerHTML = "x" + count + ` ${key}`;
		});
		//! buy section //
		Object.keys(this.upgrades).forEach((key) => {
			let id = `buy-list-item-${key}-cost`;
			const costHeader = document.getElementById(id);

			let cost;
			if (key === "health") {
				cost = this.setHealthCost();
			}
			if (key === "heal") {
				cost = this.setHealCost(health);
			}
			if (costHeader) {
				costHeader.innerText = "$ " + cost;
			}
		});
	}
}
