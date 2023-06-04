import {io} from "socket.io-client";

export var IO = {
	socket: io(),
	init: function () {
		IO.bindEvents();
	},

	// While connected, Socket.IO will listen to the following events and run the correct function.
	bindEvents: function () {
		IO.socket.on("connected", IO.onConnected);
		IO.socket.on("successfullyJoinedRoom", App.Player.updateWaitingScreen);
		IO.socket.on("closeGame", App.Player.onLeaveClick);
		IO.socket.on("error", function (e) {
			console.error(e.stack);
		});
	},

	onConnected: function () {
		// cache a copy of the clients socket.IO section on this app instance
		App.mySocketId = IO.socket.id;
	},

	error: function (data: any) {
		alert("Something went wrong");
	}
};

export var App = {
	gameId: "0", // identical to id of Socket.IO room
	myRole: "", //Player or Host browser
	mySocketId: "", //Socket.io socket object identifier. Unique to user when browser initially connects

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
		}
	},

	// Code for the player browsers
	Player: {
		HostSocketId: "", // A reference to the socket ID of the Host
		myName: "", // The player's name entered on the join screen

		// The player entered their name and gameId and clicks join server
		onJoinClick: function (id: number, name: string) {
			//console.log('clicked to join room ' + id);
			App.gameId = id.toString();
			App.myRole = "Player";
			App.Player.myName = name || "Guest";
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
