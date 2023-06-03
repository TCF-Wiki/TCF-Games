import {io} from "socket.io-client";
import {emitter} from "./main";
import {toast} from "@/main";

export var IO = {
	socket: io(),
	init: function () {
		IO.bindEvents();
	},
	// While connected, Socket.IO will listen to the following events and run the correct function.
	bindEvents: function () {
		IO.socket.on("connected", IO.onConnected);
		IO.socket.on("error", IO.error);
		IO.socket.on("newPlayerJoinedRoom", App.NewPlayerJoinedRoom);
		IO.socket.on("playerLeftRoom", App.PlayerLeftRoom);
		IO.socket.on("playerList", App.UpdatePlayerList);
		IO.socket.on("hostLeft", App.HostLeft);
		IO.socket.on("nameChanged", App.NameChanged);
		//Emitter events
		emitter.on("JoinRoom", (roomId: string) => {
			App.JoinRoom(roomId);
		});
		emitter.on("CreateRoom", (roomId: string) => {
			App.CreateRoom();
		});
		emitter.on("LeaveRoom", () => {
			App.LeaveRoom();
		});
		emitter.on("ChangeName", (name: string) => {
			App.myPlayerData.name = name;
			IO.socket.emit("changeName", name);
		});
	},
	onConnected: function () {
		App.CreateRoom();
		App.myPlayerData = {
			name: "Player",
			socketId: IO.socket.id
		};
	},
	error: function (data: any) {
		alert("Something went wrong");
	}
};

export type PlayerDataType = {
	name: string;
	socketId: string;
	gameData?: any;
};

export var App = {
	roomId: null as string | null,
	playerList: [] as PlayerDataType[],
	myPlayerData: {} as PlayerDataType,
	host: false,

	//Functions:
	async CreateRoom() {
		IO.socket.emit("createRoom");
		IO.socket.on("roomCreated", (roomId: string) => {
			App.roomId = roomId;
			App.playerList = [] as PlayerDataType[];
			App.host = true;
			App.playerList.push(App.myPlayerData);
			App.UpdatePlayerList(App.playerList);
			emitter.emit("RoomJoined", roomId);
			toast.success("Room created!");
		});
	},
	JoinRoom(roomId: string) {
		IO.socket.emit("joinRoom", roomId, App.myPlayerData.name);
		IO.socket.on("roomJoined", (roomId: string) => {
			App.roomId = roomId;
			App.playerList = [] as PlayerDataType[];
			App.host = false;
			emitter.emit("RoomJoined", roomId);
			toast.success("Room joined!");
		});
	},
	LeaveRoom() {
		IO.socket.emit("leaveRoom");
		App.roomId = null;
		App.playerList = [];
		emitter.emit("PlayerListUpdated", [] as PlayerDataType[]);
		toast.info("Left room!");
		App.CreateRoom();
	},
	NewPlayerJoinedRoom(data: PlayerDataType) {
		App.playerList.push(data);
		IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
		toast.success(`${data.name} joined the game!`);
	},
	PlayerLeftRoom(data: PlayerDataType) {
		App.playerList = App.playerList.filter((player) => player.socketId !== data.socketId);
		IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
		toast.error(`${data.name} left the game!`);
	},
	HostLeft(data: {oldHost: string; newHost: string}) {
		console.log("Host left");
		if (App.myPlayerData.socketId === data.newHost) {
			App.host = true;
			toast.error("The host left the game. You are the new host!");
			App.playerList = App.playerList.filter((player) => player.socketId !== data.oldHost);
			IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
		} else {
			App.host = false;
			toast.error("The host left the game. A new host has been assigned!");
		}
	},
	UpdatePlayerList(data: PlayerDataType[]) {
		App.playerList = data;
		console.log("New player list: ", App.playerList);
		toast.info("Player list updated!", {duration: 1000});
		emitter.emit("PlayerListUpdated", App.playerList);
	},
	NameChanged(data: PlayerDataType) {
		App.playerList = App.playerList.map((player) => {
			if (player.socketId === data.socketId) {
				player.name = data.name;
			}
			return player;
		});
		IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
		toast.info(`${data.name} has changed their name!`);
	}
};
