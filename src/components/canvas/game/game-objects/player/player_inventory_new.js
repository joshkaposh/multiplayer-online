import PlayerSkills from "./player_skills";

export default class PlayerInventory extends PlayerSkills {
	constructor(upgrades, ores) {
		super(upgrades);
		this.ores = {};
		this.oreValues = {};
		this.hasDiscoveredOres = {};
		const ore_names = Object.keys(ores);
		for (let i = 0; i < ore_names.length; i++) {
			this.ores[ore_names[i]] = [];
			this.oreValues[ore_names[i]] = ores[ore_names[i]].cost;
			this.hasDiscoveredOres[ore_names[i]] = false;
		}
	}

	async sell(ore) {
		if (this.ores[ore].length > 0) {
			await this.ores[ore].pop(1);
			this.currency += this.oreValues[ore];
		}
	}

	async add(ore) {
		if (!this.hasDiscoveredOres[ore]) {
			this.hasDiscoveredOres[ore] = true;
			document.getElementsByClassName(`${ore}-mystery-image`)[0].style.display = "none";
		}

		await this.ores[ore].push(1);
	}

	updateUI(stats) {
		const healCost = document.getElementById("heal-cost");
		healCost.innerText = this.setHealCost(stats.health);

		Object.keys(this.upgrades).forEach((upgrade) => {
			if (upgrade !== "heal") {
				const level = document.getElementById(`${upgrade}-level`);
				const cost = document.getElementById(`upgrade-${upgrade}-cost`);
				const current = document.getElementById(`upgrade-${upgrade}-current`);

				level.innerText = this.upgrades[upgrade].level;
				cost.innerText = this.upgrades[upgrade].cost;

				current.innerText = stats[upgrade].max || stats[upgrade].current;
			}
		});

		Object.keys(this.ores).forEach((ore) => {
			const el = document.getElementById(ore);
			const count = document.getElementById(`${ore}-count`);
			count.innerText = this.ores[ore].length;

			if (this.ores[ore].length > 0) {
				el.style.display = "block";
			} else {
				el.style.display = "none";
			}
		});
	}

	init(stats) {
		const healBtn = document.getElementById("heal");

		healBtn.addEventListener("click", this.buyHealth.bind(this, stats["health"]));

		Object.keys(this.ores).forEach((key) => {
			//! sell-section
			const btn = document.getElementById(key);
			btn.addEventListener("click", this.sell.bind(this, key));
		});

		Object.keys(this.upgrades).forEach((key) => {
			if (key !== "heal") {
				const upgradeBtn = document.getElementById(`upgrade-level-${key}`);
				const unlockBtn = document.getElementById(`upgrade-unlock-${key}`);
				unlockBtn.addEventListener("click", this.unlockSkill.bind(this, key, stats[key]));
				upgradeBtn.addEventListener("click", this.upgradeSkill.bind(this, key, stats[key]));

				if (this.upgrades[key].level > 0) {
					unlockBtn.style.display = "none";
					upgradeBtn.style.display = "block";
				} else {
					unlockBtn.style.display = "block";
					upgradeBtn.style.display = "none";
				}
			}
		});
	}
}
