import {app, io} from "./server";
import type {Socket} from "socket.io";

export type PlayerDataType = {
	name: string;
	socketId: string;
	gameData?: any;
};

export type RoomDataType = {roomId: string; hostSocket: string; gameState: "waiting" | "playing" | "done"; playerList: PlayerDataType[]};

export let roomData = [] as RoomDataType[];
export function SetRoomGameState(roomId: string, gameState: "waiting" | "playing" | "done") {
	let room = roomData.find((a) => a.roomId == roomId);
	if (!room) {
		console.log("Room not found: ", roomId);
		return;
	}
	//Update stats
	if (room.gameState == "waiting" || room.gameState == "done") realtimeWaitingRoomsCounter.dec();
	else if (room.gameState == "playing") realtimePlayingRoomsCounter.dec();
	if (gameState == "waiting" || room.gameState == "done") realtimeWaitingRoomsCounter.inc();
	else if (gameState == "playing") realtimePlayingRoomsCounter.inc();
	//Update room data
	room.gameState = gameState;
}

io.on("connection", (socket: Socket) => {
	console.log("New connection: " + socket.id);
	realtimeConnectionsCounter.inc();
	socket.emit("connected");
	socket.on("createRoom", () => {
		//Leave old rooms
		LeaveAllRooms(socket);
		//Create new room
		const roomId = GetNewRoomId();
		socket.join(roomId);
		socket.emit("roomCreated", roomId);
		roomData.push({roomId: roomId, hostSocket: socket.id, gameState: "waiting", playerList: [] as PlayerDataType[]});
		realtimeRoomsCounter.inc();
		realtimeWaitingRoomsCounter.inc();
	});
	socket.on("joinRoom", (roomId: string, name: string) => {
		console.log(name + " is joining room " + roomId);
		//Find and check room
		const room = GetRoom(roomId, socket);
		if (!room) return;
		if (room.playerList.length > 10) {
			socket.emit("error", "Room with id: '" + roomId + "' is full.");
			console.log("Room with id: '" + roomId + "' is full.");
			return;
		}
		if (room.gameState == "playing") {
			socket.emit("error", "Room with id: '" + roomId + "' is currently playing.");
			console.log("Room with id: '" + roomId + "' is is currently playing.");
			return;
		}
		//Leave old rooms
		LeaveAllRooms(socket);
		//Join room
		socket.join(roomId);
		socket.emit("roomJoined", roomId);
		//Tell host in room that a new player joined
		EmitToHost(roomId, "newPlayerJoinedRoom", {name: name, socketId: socket.id} as PlayerDataType);
	});
	socket.on("leaveRoom", () => {
		console.log(socket.id + " is leaving rooms");
		LeaveAllRooms(socket);
	});
	socket.on("kickPlayer", (socketId: string, roomId: string) => {
		//Find and check room
		const room = GetRoom(roomId, socket);
		if (!room) return;
		//Check if player is host
		if (GetHost(room.roomId) != socket.id) return;
		//Check if player is in room
		if (!room.playerList.find((a) => a.socketId == socketId)) {
			socket.emit("error", "Player not found in room.");
			console.log("Player (" + socketId + ") not found in room (" + roomId + ").");
			return;
		}
		//Kick player from io room
		io.in(socketId).socketsLeave(roomId);
		//Remove player data from room
		room.playerList = room.playerList.filter((a) => a.socketId != socketId);
		//Send player list to all players in room
		io.to(roomId).emit("playerList", room.playerList);
		//Tell player that he was kicked
		io.to(socketId).emit("kickedFromRoom");
	});
	socket.on("playerList", (data: {roomId: string; playerList: PlayerDataType[]}) => {
		//Find and check room
		const room = GetRoom(data.roomId, socket);
		if (!room) return;
		//Check if player is host
		if (GetHost(data.roomId) != socket.id) return;
		//Update player list
		roomData.find((a) => a.roomId == data.roomId)!.playerList = data.playerList;
		//Send player list to all players in room
		io.to(data.roomId).emit("playerList", data.playerList);
	});
	socket.on("disconnecting", () => {
		realtimeConnectionsCounter.dec();
		LeaveAllRooms(socket);
	});
	socket.on("changeName", (name: string) => {
		socket.rooms.forEach((roomId) => {
			if (roomId == socket.id) return;
			const room = GetRoom(roomId, socket, false);
			if (!room) return;
			EmitToHost(roomId, "nameChanged", {name: name, socketId: socket.id} as PlayerDataType);
		});
	});
});

export function EmitToHost(roomId: string, event: string, data: any) {
	let room = roomData.find((a) => a.roomId == roomId);
	if (!room) return;
	io.to(room.hostSocket).emit(event, data);
}

export function GetHost(roomId: string) {
	let room = roomData.find((a) => a.roomId == roomId);
	if (!room) return;
	return room.hostSocket;
}

export function GetRoom(roomId: string, socket: Socket, emitError: boolean = true): RoomDataType | null {
	///const room = io.sockets.adapter.rooms.get(roomId);
	const room = roomData.find((a) => a.roomId == roomId);
	if (!room) {
		if (emitError) socket.emit("error", "Room with id: '" + roomId + "' not found.");
		console.log("Room with id: '" + roomId + "' not found.");
		return null;
	}
	return room;
}

function GetNewRoomId(): string {
	let roomId = null as string | null;
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	while (!roomId) {
		roomId = "";
		for (let i = 0; i < 9; i++) {
			roomId += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		if (io.sockets.adapter.rooms.has(roomId)) {
			roomId = null;
		}
	}
	return roomId;
}

function LeaveAllRooms(socket: Socket) {
	socket.rooms.forEach((roomId) => {
		//Ignore self
		if (roomId == socket.id) return;
		//Leave rooms
		socket.leave(roomId);
		let room = GetRoom(roomId, socket, false);
		if (!room) return;
		if (room?.hostSocket == socket.id) {
			//Host left
			//Remove host from player list
			room.playerList = room.playerList.filter((a) => a.socketId != socket.id);
			//If no players left, remove room
			if (room.playerList.length == 0) {
				realtimeRoomsCounter.dec();
				if (room.gameState == "waiting" || room.gameState == "done") realtimeWaitingRoomsCounter.dec();
				else if (room.gameState == "playing") realtimePlayingRoomsCounter.dec();
				roomData = roomData.filter((a) => a.roomId != roomId);
				return;
			}
			//Else set new host
			room.hostSocket = room.playerList[0]?.socketId;
			//Tell players in room that host left
			io.to(roomId).emit("hostLeft", {oldHost: socket.id, newHost: room.hostSocket});
		} else {
			//Player left
			const room = GetRoom(roomId, socket);
			if (!room) return;
			const player = roomData.find((a) => a.roomId == roomId)?.playerList.find((a) => a.socketId == socket.id);
			if (!player) return;
			EmitToHost(roomId, "playerLeftRoom", player);
		}
	});
}

//Stats
import pm2 from "@pm2/io";
export const realtimeConnectionsCounter = pm2.counter({
	name: "Realtime connections",
	id: "app/realtime/connections",
	unit: "connections",
	historic: true
});
export const realtimeRoomsCounter = pm2.counter({
	name: "Realtime rooms",
	id: "app/realtime/rooms",
	unit: "rooms",
	historic: true
});
export const realtimePlayingRoomsCounter = pm2.counter({
	name: "Realtime playing rooms",
	id: "app/realtime/playing-rooms",
	unit: "rooms",
	historic: true
});
export const realtimeWaitingRoomsCounter = pm2.counter({
	name: "Realtime waiting rooms",
	id: "app/realtime/waiting-rooms",
	unit: "rooms",
	historic: true
});
