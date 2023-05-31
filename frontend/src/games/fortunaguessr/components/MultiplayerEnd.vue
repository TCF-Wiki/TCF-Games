<template>
	<div class="outer-container">
		<h2>
			The winner was: <span class="playerName winner"> {{ players[0].playerName }} </span>
		</h2>
		<h2 class="ranking">Player Ranking:</h2>
		<div class="container">
			<div v-for="player in players" class="inner-container">
				<span class="playerName"> {{ player.playerName }} </span> <span> {{ player.totalScore }} pts </span> <button class="button playerBtn" @click.prevent="playerClick(player)" type="button">Show Score</button>
			</div>
		</div>
	</div>
	<nav>
		<button id="restartMultiBtn" class="button" @click.prevent="restartBtnClick()">Play Again</button>
		<button id="menuMultiBtn" class="button" @click.prevent="selectBtnClick()">Select difficulty</button>
	</nav>
</template>

<script lang="ts">
	import {GameIO, GameApp} from "../multiplayer";
	import type {guessInfo} from "../gameFunctionality";
	import {getGameInformation} from "../gameFunctionality";
	import {startGame, showDifficultySelector, hideEverything} from "../main";
	import {addMarkers} from "./EndMap.vue";
	import {defineComponent} from "vue";
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;
	interface playerTypes {
		playerName: string;
		gameId: number;
		mySocketId: string;
		guessInfo: guessInfo[];
		state: string;
		totalScore: number;
	}

	export default defineComponent({
		name: "MultiplayerEnd",
		data: function () {
			return {
				players: new Array<playerTypes>()
			};
		},
		methods: {
			updateScreen: function () {
				var restartBtn = document.getElementById("restartMultiBtn");
				var menuBtn = document.getElementById("menuMultiBtn");

				if (restartBtn) restartBtn.style.display = "none";
				if (menuBtn) menuBtn.style.display = "none";
				//Show the multiplayer buttons
				if (GameApp.App.myRole == "Host") {
					//console.log(document.getElementById('restartMultiBtn'));
					if (restartBtn) restartBtn.style.display = "block";
					if (menuBtn) menuBtn.style.display = "block";
				}
				//Players
				this.players = new Array();
				GameApp.players.forEach((player: playerTypes) => {
					var newPlayerData = player;
					var total = 0;
					newPlayerData.guessInfo.forEach((guess: guessInfo) => {
						total += guess.score;
					});
					newPlayerData.totalScore = total;
					this.players.push(newPlayerData);
				});
				this.players.sort((a, b) => (a.totalScore > b.totalScore ? -1 : a.totalScore < b.totalScore ? 1 : 0));
			},
			restartBtnClick() {
				hideEverything(true);
				startGame(null, null, null, null, null);
				GameApp.Player.updatePlayerData("guessing", []);
				GameIO.socket.emit("startGameWithSeed", getGameInformation().seed, GameApp.App.gameId);
			},
			selectBtnClick() {
				hideEverything(true);
				showDifficultySelector();
				GameApp.Player.updatePlayerData("waiting", []);
			},
			playerClick(player: playerTypes) {
				toast.success("Showing guesses for " + player.playerName);
				addMarkers(player.guessInfo);
			}
		},
		mounted() {
			GameIO.socket.on("userDisconnect", this.updateScreen);
			GameIO.socket.emit("roomState", {gameId: GameApp.App.gameId, state: "ended"});
			GameApp.Player.updatePlayerData("ended", null);
			this.updateScreen();
			setTimeout(this.updateScreen, 50);
			setTimeout(this.updateScreen, 100);
			setTimeout(this.updateScreen, 1000);
		}
	});
</script>

<style scoped>
	main {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	span {
		margin: auto;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.outer-container {
		margin: 2em 0;
	}

	.inner-container {
		display: grid;
		grid-template-columns: 1fr 1fr 50%;
		column-gap: 0.5em;
		margin: 0.5em 0;
		border-bottom: 2px solid var(--primary-accent);
		padding: 0.9em 0;
	}

	.ranking {
		border-bottom: 2px solid var(--primary-accent);
		margin: 0.5em 0;
		padding: 0.9em 0;
	}

	.playerName {
		font-weight: bold;
	}

	.winner {
		color: var(--approve);
	}
	.text {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	button {
		text-align: center;
		padding: 0.5em 1em;
	}

	#playerBtn {
		padding: 0.1em 0.2em;
	}

	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 2em;
		margin-top: 3em;
	}
</style>
