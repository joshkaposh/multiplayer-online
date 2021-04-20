const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const initIO = (server) => {
	return socketIO(server, {
		cors: { origin: "http://localhost:3000" },
	});
};

module.exports = function initServer() {
	const app = express();
	const server = http.Server(app);
	const io = initIO(server);

	return { server, io };
};
