import {IO, App} from "@/multiplayer";

import {startGame, hideGuess} from "./main";
import type {guessInfo, location, gameInfo} from "./gameFunctionality";
import {resetGuessMap} from "./components/GuessMap.vue";

export var GameIO = {
	IO: IO,
	socket: IO.socket,
	init: function () {
		IO.init();
		GameIO.bindEvents();
	},
	// While connected, Socket.IO will listen to the following events and run the correct function.
	bindEvents: function () {
		GameIO.socket.on("newGameCreated", GameIO.onNewGameCreated);
		GameIO.socket.on("playerJoinedRoom", GameIO.playerJoinedRoom);
		GameIO.socket.on("userDisconnect", GameIO.userDisconnect);
		GameIO.socket.on("clientGameCanStart", GameApp.Player.startGameWithSeed);
		GameIO.socket.on("successfullyJoinedRoom", GameApp.Player.updateWaitingScreen);
		GameIO.socket.on("requestRoomMembers", GameApp.Host.playerRoomData);
		GameIO.socket.on("roomPlayerData", GameApp.Player.receivePlayerData);
		GameIO.socket.on("nextImageEvent", (data) => {
			//console.log('Next image event received: ' + data);
			resetGuessMap();
			hideGuess();
		});
		GameIO.socket.on("closeGame", GameApp.Player.onLeaveClick);
		GameIO.socket.on("updatePlayerData", GameApp.Host.updatePlayerData);
		GameIO.socket.on("error", function (e) {
			console.error(e.stack);
		});
	},

	onNewGameCreated: function (data: any) {
		GameApp.Host.gameInit(data);
		//console.log(data);
	},

	playerJoinedRoom: function (data: any) {
		// When a player joins a room, do the updateWaitingScreen function.
		GameApp.players.push(data);
		if (App.myRole === "Host") {
			GameIO.socket.emit("playerRoomData", GameApp.players);
			GameApp.Host.updateWaitingScreen(data);
		} else {
			App.Player.updateWaitingScreen(data);
		}
	},

	userDisconnect: function (data: any) {
		//console.log('User disconnected: ' + data);
		GameApp.players.forEach((player) => {
			if (player.mySocketId === data) {
				if (player.role == "Host") App.Player.onLeaveClick();
				GameApp.players.splice(GameApp.players.indexOf(player), 1);
			}
		});
		if (App.myRole === "Host") {
			GameIO.socket.emit("playerRoomData", GameApp.players);
		}
	},

	error: function (data: any) {
		alert("Something went wrong");
	}
};

export var GameApp = {
	App: App,
	gameSeed: "", // The seed of the current played round
	players: new Array(), // reference to player data

	setupPlayerData: function () {
		var playerData = {
			gameId: App.gameId,
			playerName: App.Player.myName,
			mySocketId: App.mySocketId,
			state: "waiting",
			role: "Player",
			guessInfo: {} as guessInfo
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

		// Function to init the game screen
		gameInit: function (data: any) {
			App.gameId = data.gameId;
			App.mySocketId = data.mySocketId;
			App.myRole = "Host";
			App.Player.myName = data.playerName;
			var playerData = App.setupPlayerData();
			playerData.role = "Host";
			IO.socket.emit("roomState", {gameId: App.gameId, state: "waiting"});
			GameApp.players.push(playerData);
		},

		// Function showing the waiting screen
		updateWaitingScreen: function (data: any) {
			if (GameApp.players.length >= 2) {
				//console.log('The game can start');
				if (GameApp.players.length === 10) {
					IO.socket.emit("hostRoomFull", App.gameId);
				}
			}
			return GameApp.players;
		},
		playerRoomData: function (data: any) {
			//console.log('played room data is run');
			if (App.myRole == "Host") {
				IO.socket.emit("roomPlayerData", {id: App.gameId, data: GameApp.players});
			}
		},
		updatePlayerData: function (data: any) {
			if (App.myRole == "Host") {
				//console.log('player data update reached host');
				GameApp.players.forEach((player) => {
					if (player.mySocketId === data.socketId) {
						if (data.state) player.state = data.state;
						if (data.guessInfo) player.guessInfo = data.guessInfo;
					}
				});
				GameApp.Host.playerRoomData(GameApp.players);
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
			GameApp.Player.state = "waiting";
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
		updatePlayerData: function (newState: string | null, guessInfo: guessInfo[] | null) {
			if (App.gameId == "0") return;
			//console.log('Player data update');
			if (newState) this.state = newState;

			GameApp.players.forEach((player) => {
				if (player.mySocketId === App.mySocketId) {
					if (newState) player.state = newState;
					if (guessInfo) player.guessInfo = guessInfo;
				}
			});
			IO.socket.emit("updatePlayerData", {gameId: App.gameId, socketId: App.mySocketId, state: newState, guessInfo: guessInfo});
			if (App.myRole == "Host") {
				GameApp.Host.updatePlayerData({socketId: App.mySocketId, state: newState, guessInfo: guessInfo});
			}
		},
		updateWaitingScreen: function (data: any) {
			//console.log('Update screen');
			if (IO.socket.id == data.mySocketId) {
				App.myRole = "Player";
				App.gameId = data.gameId;
			}
		},
		startGameWithSeed: function (seed: string) {
			//console.log('Game starting with seed: ' + seed);
			GameApp.Player.updatePlayerData("guessing", []);
			startGame(seed, null, null, null, null);
		},
		receivePlayerData: function (data: any) {
			//console.log('Received player data');
			if (App.myRole == "Player") {
				if (data instanceof Array) {
					GameApp.players = new Array();
					data.forEach((player) => {
						GameApp.players.push(player);
					});
				} else {
					GameApp.players.push(data);
				}
			}
		}
	}
};
