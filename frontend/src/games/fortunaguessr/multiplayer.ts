import {emitter, toast} from "@/main";
import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";
import {IO, App, type PlayerDataType} from "@/multiplayer";

export var GameIO = {
	started: false,
	init() {
		if (this.started) return;
		this.bindEvents();
		this.started = true;
	},
	bindEvents() {
		IO.socket.on("gameStarted", GameApp.GameStarted);
		IO.socket.on("nextRoundStarted", GameApp.NextRoundStarted);
		IO.socket.on("guessSubmitted", GameApp.GuessSubmitted);
		IO.socket.on("backToLobby", GameApp.BackToLobby);
		IO.socket.on("gameEnded", GameApp.GameEnded);
	}
};

export var GameApp = {
	StartGame(seed: string) {
		IO.socket.emit("startGame", {seed: seed, roomId: App.roomId});
		//Reset player game data
		App.UpdatePlayerData(
			App.playerList.map((player) => {
				player.gameData = {
					guesses: [] as guessInfoType[],
					score: 0
				};
				return player;
			})
		);
	},
	GameStarted(seed: string) {
		emitter.emit("StartGameWithSeed", seed);
	},
	StartNextRound() {
		IO.socket.emit("nextRound", App.roomId);
	},
	NextRoundStarted() {
		emitter.emit("NextRound");
	},
	SubmitGuess(guessInfo: guessInfoType) {
		IO.socket.emit("submitGuess", {roomId: App.roomId, guess: guessInfo});
	},
	GuessSubmitted(data: {guess: guessInfoType; socket: string}) {
		//Update player game data
		App.UpdatePlayerData(
			App.playerList.map((player) => {
				if (player.socketId == data.socket) {
					player.gameData.guesses.push(data.guess);
					player.gameData.score += data.guess.score;
				}
				return player;
			})
		);
	},
	SendBackToLobby() {
		IO.socket.emit("backToLobby", App.roomId);
	},
	BackToLobby() {
		emitter.emit("BackToLobby");
	},
	SendGameEnded() {
		IO.socket.emit("endGame", App.roomId);
	},
	GameEnded() {
		emitter.emit("GameEnded");
	}
};
