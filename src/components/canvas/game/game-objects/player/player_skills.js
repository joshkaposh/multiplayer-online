export default class PlayerSkills {
	constructor(upgrades) {
		this.upgrades = upgrades;
		this.currency = 0;
	}

	setHealCost(stats) {
		let upgrade = this.upgrades["heal"];
		let costPerHP = upgrade.unitCost;
		let missingHP = stats.max - Math.ceil(stats.current);
		let cost = Math.trunc(missingHP * costPerHP);

		if (cost > this.currency) {
			upgrade.cost = Math.trunc(this.currency / costPerHP) * costPerHP;
		} else {
			upgrade.cost = cost;
		}
		return cost;
	}

	buyHealth(stats) {
		let upgrade = this.upgrades["heal"];
		let costPerHP = upgrade.unitCost;
		let missingHP = stats.max - stats.current;
		let cost = Math.trunc(missingHP * costPerHP);

		if (cost > this.currency) {
			let new_cost = Math.trunc(this.currency / costPerHP) * costPerHP;
			if (new_cost <= this.currency) {
				const hpHealed = Math.trunc(new_cost / costPerHP);
				stats.current += hpHealed;
				this.currency -= new_cost;
			}

			upgrade.cost = new_cost;
		} else {
			const hpHealed = Math.trunc(cost / costPerHP);
			stats.current += hpHealed;
			this.currency -= cost;
			upgrade.cost = cost;
		}
	}

	upgradeSkill(skill, stat) {
		let upgrade = this.upgrades[skill];
		if (upgrade.cost <= this.currency) {
			this.currency -= upgrade.cost;
			if (stat.max) {
				stat.max += upgrade.levelInc;
			}
			stat.current += upgrade.levelInc;
			upgrade.cost = upgrade.cost += upgrade.costInc;
			upgrade.level++;
		}
	}

	unlockSkill(skill, stat) {
		let upgrade = this.upgrades[skill];
		console.log(stat);
		if (!upgrade.unlocked) {
			if (upgrade.cost <= this.currency) {
				upgrade.unlocked = true;
				console.log("unlocking skill: %s", skill);

				upgrade.level++;
				this.currency -= upgrade.cost;
				upgrade.cost = upgrade.cost += upgrade.costInc;

				const unlockBtn = document.getElementById(`upgrade-unlock-${skill}`);
				const upgradeBtn = document.getElementById(`upgrade-level-${skill}`);

				unlockBtn.style.display = "none";
				upgradeBtn.style.display = "block";
				console.log("upgrading skill: %s, level: %s, cost: %s", skill, upgrade.level, upgrade.cost);
			} else {
				console.log("cant upgrade skill: no money. Money: %s, Cost: %s", upgrade.cost, this.currency);
			}
		}
	}
}
