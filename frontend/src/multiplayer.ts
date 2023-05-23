import {io} from "socket.io-client";

export var IO = {
	socket: io(),
	init: function () {
		IO.bindEvents();
	},

	// While connected, Socket.IO will listen to the following events and run the correct function.
	bindEvents: function () {},

	onConnected: function () {
		// cache a copy of the clients socket.IO section on this app instance
		App.mySocketId = IO.socket.id;
	},

	playerJoinedRoom: function (data: any) {
		// When a player joins a room, do the updateWaitingScreen function.
		App.players.push(data);
		if (App.myRole === "Host") {
			IO.socket.emit("playerRoomData", App.players);
			///App.Host.updateWaitingScreen(data);
		} else {
			///App.Player.updateWaitingScreen(data);
		}
	},

	userDisconnect: function (data: any) {
		//console.log('User disconnected: ' + data);
		App.players.forEach((player) => {
			if (player.mySocketId === data) {
				if (player.role == "Host") App.Player.onLeaveClick();
				App.players.splice(App.players.indexOf(player), 1);
			}
		});
		if (App.myRole === "Host") {
			IO.socket.emit("playerRoomData", App.players);
		}
	},

	error: function (data: any) {
		alert("Something went wrong");
	}
};

export var App = {
	gameId: "0", // identical to id of Socket.IO room
	myRole: "", //Player or Host browser
	mySocketId: "", //Socket.io socket object identifier. Unique to user when browser initially connects
	gameSeed: "", // The seed of the current played round
	players: new Array(), // reference to player data

	setupPlayerData: function () {
		var playerData = {
			gameId: App.gameId,
			playerName: App.Player.myName,
			mySocketId: App.mySocketId,
			state: "waiting",
			role: "Player"
		};
		return playerData;
	},
	// code for the host browser
	Host: {
		// handler to start the first game
		onCreateClick: function () {
			//console.log('Clicked create a game');
			IO.socket.emit("hostCreateNewRoom");
		},
		onCloseClick: function () {
			//console.log('Close game');
			IO.socket.emit("closeGame", App.gameId);
			IO.socket.close();
			location.reload();
		},
		playerRoomData: function (data: any) {
			//console.log('played room data is run');
			if (App.myRole == "Host") {
				IO.socket.emit("roomPlayerData", {id: App.gameId, data: App.players});
			}
		},
		updatePlayerData: function (data: any) {
			if (App.myRole == "Host") {
				//console.log('player data update reached host');
				App.players.forEach((player) => {
					if (player.mySocketId === data.socketId) {
						if (data.state) player.state = data.state;
						if (data.guessInfo) player.guessInfo = data.guessInfo;
					}
				});
				App.Host.playerRoomData(App.players);
			}
		}
	},

	// Code for the player browsers
	Player: {
		HostSocketId: "", // A reference to the socket ID of the Host
		myName: "", // The player's name entered on the join screen
		state: "", // The state of the player in the game (waiting, guessing, ready, done etc)

		// The player entered their name and gameId and clicks join server
		onJoinClick: function (id: number, name: string) {
			//console.log('clicked to join room ' + id);
			App.gameId = id.toString();
			App.myRole = "Player";
			App.Player.state = "waiting";
			App.Player.myName = name || "anon";
			var data = App.setupPlayerData();
			// Send the player data to the server
			IO.socket.emit("playerJoinGame", data);
		},
		onLeaveClick: function () {
			//console.log('Leave game');
			IO.socket.close();
			location.reload();
		},
		updateWaitingScreen: function (data: any) {
			//console.log('Update screen');
			if (IO.socket.id == data.mySocketId) {
				App.myRole = "Player";
				App.gameId = data.gameId;
			}
		}
	}
};
