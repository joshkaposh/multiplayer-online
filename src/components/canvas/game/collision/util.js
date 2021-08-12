export const lerp = (x, target, amount) => x + (target - x) * amount;
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const invlerp = (x, y, a) => clamp((a - x) / (y - x));
export const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
	let a = x1 - x2;
	let b = y1 - y2;
	return Math.sqrt(a * a + b * b);
};
export const getDistanceXY = (a, b) => {
	let distX = Math.abs(a.y - b.x);
	let distY = Math.abs(a.y - b.y);
	return {
		distX,
		distY,
		dist: Math.sqrt(distX + distY),
	};
};
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
export const collision = {
	circleRect: (cX, cY, cR, rX, rY, rW, rH) => {
		let distX = Math.abs(cX - rX - rW / 2);
		let distY = Math.abs(cY - rY - rH / 2);

		if (distX > rW / 2 + cR) return false;
		if (distY > rH / 2 + cR) return false;

		if (distX <= rW / 2) return true;
		if (distY <= rH / 2) return true;

		let dx = distX - rW / 2;
		let dy = distY - rH / 2;
		// checks rect corners
		return dx * dx + dy * dy <= cR * cR;
	},
};
const util = {
	lerp,
	invlerp,
	clamp,
	getDistance,
	randomInt,
	collision,
};

export default util;
