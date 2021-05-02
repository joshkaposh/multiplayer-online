const mongoose = require("mongoose");

const user = new mongoose.Schema({
	level: Number,
	username: String,
	_id: String,
});

const user_model = mongoose.model("user", user);

const models = {
	user_model,
};

module.exports = models;
