import Entity from "../entities/entity";
import PlayerInventory from "./player_inventory_new";
import PlayerCollision from "../../collision/collision";
import PlayerMine from "./player_mine";
export default class PlayerEntity extends Entity {
	constructor(health, pos, width, height, speed, tilesize, columns, rows, mapW, mapH, tileFrames, ores) {
		// ores, oreValues
		super(health, pos, width, height, speed, tilesize);
		this.dmgOverTime = 0.005;
		this.fallingMinVelocity = 17.5;
		this.stats.mining_speed = { current: 10 };
		this.inventory = new PlayerInventory(
			{
				health: {
					level: 1,
					levelInc: 100,
					unlocked: true,
					baseCost: 100,
					cost: 100,
					costInc: 100,
				},
				mining_speed: {
					level: 1,
					levelInc: 5,
					unlocked: true,
					baseCost: 100,
					cost: 100,
					costInc: 200,
					buff: 5,
				},
				heal: {
					unitCost: 3,
					cost: 0,
				},
			},
			ores
		);
		this.collision = new PlayerCollision(speed, tilesize, columns, rows, mapW, mapH);
		this.drill = new PlayerMine(
			this.inventory,
			this.collision,
			speed,
			tilesize,
			columns,
			rows,
			mapW,
			mapH,
			tileFrames
		);
	}

	fallDamage(yVelocity) {
		let dmg = yVelocity * 3;
		this.damage(dmg);
	}

	damageOverTime() {
		this.damage(this.dmgOverTime);
	}
}
