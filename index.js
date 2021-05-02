const initServer = require("./startup");
const { server, io } = initServer();
const connectToDatabase = require("./db/connect");
const models = require("./db/schema");

const getUniqueID = () => {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return s4() + s4() + "-" + s4();
};

const askUserForName = (socket) => {
	socket.emit("greeting", {
		username: "",
		_id: getUniqueID(),
	});
};

const askForDifferentName = (socket) => {
	socket.emit("retryName", {
		username: "",
		_id: getUniqueID(),
	});
};

const doesUserExist = async (data) => {
	let result = false;

	await models.user_model
		.find({ username: data.username })
		.exec()
		.then((r) => {
			if (r.length !== 0) result = true;
		})
		.catch((err) => console.error(err));
	return result;
};

const UserCRUD = {
	create: "",
	read: "",
	update: async (query, update) => {
		console.log(query, update);
		const q = await models.user_model.updateOne(query, update);
		console.log(q);
	},
	delete: "",
};

const ioHandlers = {
	input: {
		receiveNameHandler: (socket) => {
			socket.on("nameResponse", async (data) => {
				const user = await doesUserExist(data);
				if (user) {
					socket.emit("oldUser", user);
					// askForDifferentName(socket);
				} else {
					models.user_model.create(data);
					io.sockets.emit("newUser", data);
				}
				// redirect to game
				socket.emit("loadGame", data);

				console.log(user);
			});
		},
		playerMoved: (socket) => {
			socket.on("direction", (data) => {
				console.log(data);
				io.sockets.emit("playerMove", data);
			});
		},
		expGain: (socket) => {
			socket.on("expGain", (data) => {
				// const { username, _id, exp } = user;
				// console.log(user);
				console.log(data);
				// if (!_id || !username || !exp) return;
				// UserCRUD.update({ username, _id }, { exp });
				// UserCRUD.update({ username, _id }, { level: exp });
			});
		},
	},
};

server.listen(5000, function () {
	console.log("Starting server on port 5000");
	connectToDatabase();

	// Add the WebSocket handlers
	io.on("connection", function (socket) {
		askUserForName(socket);
		ioHandlers.input.receiveNameHandler(socket);
		ioHandlers.input.playerMoved(socket);
		ioHandlers.input.expGain(socket);

		socket.on("mousemove", (data) => {
			io.sockets.emit("playerMove", data);
		});
	});
});
