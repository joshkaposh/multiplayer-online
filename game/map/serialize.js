const replacer = (key, value) => {
	if (typeof key === "function") {
		console.log(key.toString());
	}

	if (typeof value === "function") {
		return value.toString();
	}
	return value;
};

function serialize(map) {
	let temp = [];
	for (let i = 0; i < map.length; i++) {
		let serialized = JSON.stringify(map[i], replacer);
		temp.push(serialized);
	}
	return temp;
}

module.exports = serialize;
