import {io} from "socket.io-client";
import {emitter} from "./main";
import {toast} from "@/main";

export var IO = {
	socket: io(),
	init: function () {
		///console.log("Initializing socket.io");
		IO.bindEvents();
	},
	// While connected, Socket.IO will listen to the following events and run the correct function.
	bindEvents: function () {
		IO.socket.on("connected", IO.onConnected);
		IO.socket.on("error", IO.error);
		IO.socket.on("newPlayerJoinedRoom", App.NewPlayerJoinedRoom);
		IO.socket.on("playerLeftRoom", App.PlayerLeftRoom);
		IO.socket.on("playerList", App.RecievedUpdatedPlayerList);
		IO.socket.on("hostLeft", App.HostLeft);
		IO.socket.on("kickedFromRoom", App.KickedFromRoom);
		IO.socket.on("nameChanged", App.NameChanged);
	},
	onConnected: function () {
		///console.log("Connected to server");
		App.CreateRoom();
		const baseNames = ["Prospector", "Leafman", "Crusher", "Bertha", "Jeff", "KoroSlave", "Strider", "Tick", "Badum", "Rattler", "Howler", "Blueman"];
		let localStorageName = localStorage.getItem("username");
		// if their username is one of the default usernames we give them a new one. We check if its default
		// by removing the default 5 numbers and then checking if its in our list of base names.
		if (localStorageName && baseNames.includes(localStorageName?.slice(0, -5))) localStorageName = null;
		let name =
			localStorageName ??
			(() => {
				let number = Math.floor(Math.random() * 100000).toString();
				while (number.length < 5) number = "0" + number;
				return baseNames[Math.floor(baseNames.length * Math.random())] + number;
			})();
		App.myPlayerData = {
			name: name,
			socketId: IO.socket.id ?? ""
		};
		emitter.emit("RefreshName", name);
	},
	error: function (error: string) {
		console.log(error);
		toast.error("Error: " + error);
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
	isHost: false,

	//Functions:
	CreateRoom() {
		IO.socket.emit("createRoom");
		IO.socket.on("roomCreated", (roomId: string) => {
			App.roomId = roomId;
			App.playerList = [] as PlayerDataType[];
			App.isHost = true;
			App.playerList.push(App.myPlayerData);
			App.RecievedUpdatedPlayerList(App.playerList);
			emitter.emit("RoomJoined", roomId);
			emitter.emit("HostChanged", true);
			///toast.success("Room created!");
		});
	},
	JoinRoom(roomId: string, name: string) {
		App.myPlayerData.name = name;
		IO.socket.emit("joinRoom", roomId, App.myPlayerData.name);
		IO.socket.on("roomJoined", (roomId: string) => {
			App.roomId = roomId;
			App.playerList = [] as PlayerDataType[];
			App.isHost = false;
			emitter.emit("RoomJoined", roomId);
			emitter.emit("HostChanged", false);
			///toast.success("Room joined!");
		});
	},
	LeaveRoom() {
		IO.socket.emit("leaveRoom");
		App.roomId = null;
		App.playerList = [];
		emitter.emit("PlayerListUpdated", [] as PlayerDataType[]);
		///toast.info("Left room!");
		App.CreateRoom();
	},
	KickPlayer(socketId: string) {
		IO.socket.emit("kickPlayer", socketId, App.roomId);
	},
	KickedFromRoom() {
		App.roomId = null;
		App.playerList = [];
		emitter.emit("PlayerListUpdated", [] as PlayerDataType[]);
		toast.error("You were kicked from the room!");
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
		///console.log("Host left");
		if (App.myPlayerData.socketId === data.newHost) {
			App.isHost = true;
			toast.error("The host left the game. You are the new host!");
			App.playerList = App.playerList.filter((player) => player.socketId !== data.oldHost);
			IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
		} else {
			App.isHost = false;
			toast.error("The host left the game. A new host has been assigned!");
		}
		emitter.emit("HostChanged");
	},
	UpdatePlayerData(data: PlayerDataType[]) {
		App.playerList = data;
		IO.socket.emit("playerList", {roomId: App.roomId, playerList: App.playerList});
	},
	RecievedUpdatedPlayerList(data: PlayerDataType[]) {
		App.playerList = data;
		App.myPlayerData = App.playerList.find((player) => player.socketId === IO.socket.id) as PlayerDataType;
		console.log("(For debugging) New player list data: ", App.playerList);
		///console.log("My player data: ", App.myPlayerData);
		///toast.info("Player list updated!", {duration: 1000});
		emitter.emit("PlayerListUpdated", App.playerList);
	},
	ChangeName(newName: string) {
		App.myPlayerData.name = newName;
		localStorage.setItem("username", newName);
		IO.socket.emit("changeName", newName);
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
