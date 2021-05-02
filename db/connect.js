const mongoose = require("mongoose");

const connectToDatabase = () => {
	return new Promise((res, rej) => {
		mongoose.connect("mongodb://localhost/multiplayer_online", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = mongoose.connection;

		db.on("error", (err) => {
			rej(err);
		});
		db.once("open", function () {
			// we're connected!
			console.log("Connected");
		});
		res("connected");
	});
};

module.exports = connectToDatabase;
