export const lerp = (x, target, amount) => x + (target - x) * amount;
export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const invlerp = (x, y, a) => clamp((a - x) / (y - x));

const util = {
	lerp,
	invlerp,
	clamp,
};

export default util;
