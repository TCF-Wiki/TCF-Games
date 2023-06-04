console.log("Loaded fortunaguessr");
import {app, io} from "../../server";
import {EmitToHost, GetRoom} from "../../mainLogic";
import type {Socket} from "socket.io";

io.on("connection", (socket: Socket) => {
	socket.on("startGame", (data: {seed: string; roomId: string}) => {
		//Find and check room
		const room = GetRoom(data.roomId, socket);
		if (!room) return;
		//Start game
		console.log("Game started with seed: " + data.seed);
		io.to(data.roomId).emit("gameStarted", data.seed);
	});
	socket.on("nextRound", (roomId: string) => {
		//Find and check room
		const room = GetRoom(roomId, socket);
		if (!room) return;
		//Start next round
		console.log("Next round started");
		io.to(roomId).emit("nextRoundStarted");
	});
	socket.on("submitGuess", (data: {roomId: string; guess: any}) => {
		//Find and check room
		const room = GetRoom(data.roomId, socket);
		if (!room) return;
		//Submit guess
		console.log("Guess submitted");
		EmitToHost(data.roomId, "guessSubmitted", {guess: data.guess, socket: socket.id});
	});
});
