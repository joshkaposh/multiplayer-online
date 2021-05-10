const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

module.exports = function initServer() {
	const app = express();
	const server = http.Server(app);
	const io = socketIO(server, {
		cors: { origin: "http://localhost:3000" },
	});

	return { server, io };
};
