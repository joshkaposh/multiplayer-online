const mongoose = require("mongoose");

const connectToDatabase = () => {
	return new Promise((res, rej) => {
		// ! important: connect to online db instead of local
		mongoose.connect("mongodb://localhost:27888/multiplayer_online", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = mongoose.connection;

		db.on("error", (err) => {
			rej(err);
			throw new Error(err);
		});
		db.once("open", function () {
			// we're connected!
			console.log("Connected");
		});
		res("connected");
	});
};

module.exports = connectToDatabase;
