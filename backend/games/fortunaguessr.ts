console.log("Loaded fortunaguessr");
import {app, io} from "../server";
import {EmitToHost, GetRoom, GetHost, SetRoomGameState} from "../mainLogic";
import type {Socket} from "socket.io";

io.on("connection", (socket: Socket) => {
	socket.on("startGame", (data: {seed: string; roomId: string}) => {
		//Find and check room
		if (!GetRoom(data.roomId, socket)) return;
		//Check if player is host
		if (GetHost(data.roomId) != socket.id) return;
		//Start game
		console.log("Game started with seed: " + data.seed);
		SetRoomGameState(data.roomId, "playing");
		io.to(data.roomId).emit("gameStarted", data.seed);
	});
	socket.on("nextRound", (roomId: string) => {
		//Find and check room
		if (!GetRoom(roomId, socket)) return;
		//Check if player is host
		if (GetHost(roomId) != socket.id) return;
		//Start next round
		console.log("Next round started");
		io.to(roomId).emit("nextRoundStarted");
	});
	socket.on("endGame", (roomId: string) => {
		//Find and check room
		if (!GetRoom(roomId, socket)) return;
		//Check if player is host
		if (GetHost(roomId) != socket.id) return;
		//End game
		console.log("Game ended");
		SetRoomGameState(roomId, "done");
		io.to(roomId).emit("gameEnded");
	});
	socket.on("submitGuess", (data: {roomId: string; guess: any}) => {
		//Find and check room
		const room = GetRoom(data.roomId, socket);
		if (!room) return;
		//Calculate score
		let score = 0;
		let distance = -1;
		if (data.guess.map == data.guess.imageData.map) {
			//Distance between guess and actual location
			let distanceX = Math.abs(data.guess.location[0] - data.guess.imageData.x);
			let distanceY = Math.abs(data.guess.location[1] - data.guess.imageData.y);
			distance = Math.round(Math.sqrt(distanceX * distanceX + distanceY * distanceY) * 8 * 100) / 100;
			//Precision variance
			if (distance - 7 < 0) distance = 0;
			else distance -= 7;
			//Actual score
			score = Math.round(Math.pow(1.11, -0.03 * distance) * 5000);
			if (score <= 0) score = 0;
		}
		data.guess.distance = distance;
		data.guess.score = score;
		//Submit guess
		EmitToHost(data.roomId, "guessSubmitted", {guess: data.guess, socket: socket.id});
	});
	socket.on("backToLobby", (roomId: string) => {
		//Find and check room
		if (!GetRoom(roomId, socket)) return;
		//Check if player is host
		if (GetHost(roomId) != socket.id) return;
		//Send back to lobby
		console.log("Back to lobby");
		SetRoomGameState(roomId, "waiting");
		io.to(roomId).emit("backToLobby");
	});
});
