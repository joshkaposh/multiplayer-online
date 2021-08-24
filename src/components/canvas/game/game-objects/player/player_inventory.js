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
			player.stats.health += hpHealed;
			return true;
		}
		return false;
	}
}

export default class Inventory {
	constructor(health, ores, oreValues) {
		// TODO: sync up health to character,
		this.ores = {};
		this.oreValues = {};
		for (let i = 0; i < ores.length; i++) {
			this.ores[ores[i]] = [];
			this.oreValues[ores[i]] = oreValues[ores[i]].cost;
		}
		this.upgrades = new Upgrades(health);
		this.isVisible = false;
		this.reset = false;
		this.exit = false;
		this.money = 0;
	}

	addMoney(amount) {
		this.money += amount;
		console.log(this.money);
	}

	subMoney(amount) {
		this.money -= amount;
	}

	initDeathMenu() {
		document.getElementById("retry-game").addEventListener("click", (e) => {
			// reset
		});
		document.getElementById("exit-game").addEventListener("click", (e) => {
			// exit
		});
	}

	init(player) {
		Object.keys(this.ores).forEach((key) => {
			//! sell-section
			const btn = document.getElementById(key + "-sell");
			const sellAllBtn = document.getElementById(key + "-sell-all");
			btn.addEventListener("click", this.sell.bind(this, key, this.money, this.addMoney.bind(this, this.money)));
			sellAllBtn.addEventListener(
				"click",
				this.sellAll.bind(this, key, this.money, this.addMoney.bind(this, this.money))
			);
		});

		Object.keys(this.upgrades).forEach((key) => {
			//! buy-section
			const btn = document.getElementById(`buy-${key}`);
			btn.addEventListener(
				"click",
				this.buy.bind(this, key, player, this.money, this.addMoney.bind(this, this.money))
			);
		});

		const exitBtn = document.getElementById("inventory-exit");
		exitBtn.addEventListener("click", (e) => {
			e.preventDefault();
			this.hide();
		});
		this.initDeathMenu();
	}

	buy(upgrade, player, money, cb) {
		let cost, didUpgrade;
		switch (upgrade) {
			case "heal":
				cost = this.setHealCost(player.health);
				didUpgrade = this.upgrades.healPlayer(player, cost, money);
				break;
			case "health":
				cost = this.setHealthCost();
				didUpgrade = this.upgrades.increaseMaxHealth(player, cost, money);
				break;
			default:
				break;
		}
		if (didUpgrade) {
			money -= cost;
		}
	}

	sellAll(ore, money, cb) {
		if (this.ores[ore].length === 0) return;
		console.log(ore, money);
		let count = this.ores[ore].length;
		let gained = count * this.oreValues[ore];
		this.ores[ore].length = 0;
		money += gained;
	}

	sell(ore, money, cb) {
		if (this.ores[ore].length === 0) return;
		this.money += this.oreValues[ore];
		cb(this.oreValues[ore]);
		// console.log("after::: ore: %s, money: %s", ore, money);

		this.ores[ore].length -= 1;
	}

	async add(ore) {
		await this.ores[ore].push(1);
	}

	setHealthCost() {
		// costPerUnit * amountOfUnits + statLevel * costPerlevel

		return (
			this.upgrades["health"].costPerHP * this.upgrades["health"].inc +
			this.upgrades["health"].levelInc * this.upgrades["health"].level
		);
	}

	setHealCost(health, money) {
		let currentHP = health;
		let costPerHP = this.upgrades["heal"].inc;
		let buyCount = Math.trunc(money / costPerHP);
		let fullHP = this.upgrades.health.maxHP;
		let missingHP = fullHP - currentHP;

		let cost = Math.trunc(missingHP * costPerHP);

		if (cost > money) {
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

			if (this.ores[key].length > 0) {
				let cost = this.ores[key].length * this.oreValues[key];

				item.style.display = "inline-flex";
				value.innerHTML = "$ " + cost;
				header.innerHTML = "x" + this.ores[key].length + ` ${key}`;
			} else {
				item.style.display = "none";
			}
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
				cost = this.setHealCost(health, this.money);
			}
			if (costHeader) {
				costHeader.innerText = "$ " + cost;
			}
		});
	}
}