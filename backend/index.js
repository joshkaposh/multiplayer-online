const initServer = require("./startup");
const { server, io } = initServer();

const getUniqueID = () => {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return s4() + s4() + "-" + s4();
};

server.listen(5000, function () {
	console.log("Starting server on port 5000");

	// Add the WebSocket handlers
	io.on("connection", function (socket) {
		socket.emit("greeting", {
			username: "",
			_id: getUniqueID(),
		});

		socket.on("nameResponse", (data) => {
			// save to database
			// redirect to game
			socket.emit("loadGame", data);

			console.log(data);
		});
	});
});
