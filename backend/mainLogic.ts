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
	room.gameState = gameState;
}
setInterval(function () {
	///console.log("RoomData", roomData);
}, 5000);

io.on("connection", (socket: Socket) => {
	console.log("New connection: ", socket.id);
	socket.emit("connected");
	socket.on("createRoom", () => {
		//Leave old rooms
		LeaveAllRooms(socket);
		//Create new room
		const roomId = GetNewRoomId();
		socket.join(roomId);
		socket.emit("roomCreated", roomId);
		roomData.push({roomId: roomId, hostSocket: socket.id, gameState: "waiting", playerList: [] as PlayerDataType[]});
	});
	socket.on("joinRoom", (roomId: string, name: string) => {
		console.log("Joining room: ", roomId);
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
		console.log("Leaving rooms");
		LeaveAllRooms(socket);
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
		LeaveAllRooms(socket);
	});
	socket.on("changeName", (name: string) => {
		socket.rooms.forEach((roomId) => {
			const room = GetRoom(roomId, socket);
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

export function GetRoom(roomId: string, socket: Socket): RoomDataType | null {
	///const room = io.sockets.adapter.rooms.get(roomId);
	const room = roomData.find((a) => a.roomId == roomId);
	if (!room) {
		socket.emit("error", "Room with id: '" + roomId + "' not found.");
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
		let room = roomData.find((a) => a.roomId == roomId);
		if (!room) return;
		if (room?.hostSocket == socket.id) {
			//Host left
			//Remove host from player list
			room.playerList = room.playerList.filter((a) => a.socketId != socket.id);
			//If no players left, remove room
			if (room.playerList.length == 0) roomData = roomData.filter((a) => a.roomId != roomId);
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
