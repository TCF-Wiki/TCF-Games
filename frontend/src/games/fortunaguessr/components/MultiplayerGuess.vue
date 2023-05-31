<template>
	<div>
		<div id="scoreList"></div>
		<h2>{{ title }}</h2>
		<div>
			<h2>Player scores:</h2>
			<div class="container">
				<div class="inner-container">
					<span> Player </span>
					<span> Distance </span>
					<span> Score </span>
					<span> Total </span>
				</div>
				<div v-for="player in players" class="inner-container">
					<span class="player"> {{ player.playerName }} </span>
					<span> {{ player.guessInfo[player.guessInfo.length - 1].distance == -1 ? "Wrong Map" : distanceDisplayer(player.guessInfo[player.guessInfo.length - 1].distance) }} </span>
					<span> {{ player.guessInfo[player.guessInfo.length - 1].score.toString() }} </span>
					<span> {{ player.totalScore }} </span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {GameIO, GameApp} from "../multiplayer";
	import {distanceDisplayer, hideGuess} from "../main";
	import {getImgNumber, getGuessInformation} from "../gameFunctionality";
	import type {guessInfo} from "../gameFunctionality";
	import {defineComponent} from "vue";
	import {updateMarkers} from "./GuessMap.vue";
	interface playerTypes {
		playerName: string;
		gameId: number;
		mySocketId: string;
		guessInfo: guessInfo[];
		state: string;
		totalScore: number;
	}

	export default defineComponent({
		name: "MultiplayerGuess",
		data: function () {
			return {
				players: new Array<playerTypes>(),
				playerAmount: GameApp.players.length,
				readyPlayers: 0,
				title: ""
			};
		},
		methods: {
			updateScreen: function () {
				let button = document.getElementById("nextBtn");
				if (button) {
					if (GameApp.App.myRole != "Host") {
						button.style.visibility = "hidden";
						button.style.position = "absolute";
					} else {
						button.style.visibility = "visible";
						button.style.position = "relative";
					}
				}
				this.title = "Waiting for all players to guess...";
			},
			nextReady: function () {
				//console.log('Everyone is ready');
				//console.log(App.myRole);
				if (GameApp.App.myRole == "Host") {
					this.title = "Everyone has guessed, click next to continue";
					let button = document.getElementById("nextBtn");
					if (button) {
						button.style.visibility = "visible";
						button.style.position = "relative";
					}
				} else {
					this.title = "Waiting for host to start next round...";
				}
			},
			checkReadyState: function () {
				//console.log('Checking ready amount');
				let readyAmount = 0;
				//console.log(App.players);
				this.players = new Array();
				GameApp.players.forEach((player: playerTypes) => {
					if (player.state == "ready") {
						var newPlayerData = player;
						var total = 0;
						newPlayerData.guessInfo.forEach((guess: guessInfo) => {
							total += guess.score;
						});
						newPlayerData.totalScore = total;
						this.players.push(newPlayerData);
						readyAmount++;
					}
				});
				this.players.sort((a, b) => {
					let aDistance = a.guessInfo[a.guessInfo.length - 1]["distance"] == -1 ? 5000 : a.guessInfo[a.guessInfo.length - 1]["distance"];
					let bDistance = b.guessInfo[b.guessInfo.length - 1]["distance"] == -1 ? 5000 : b.guessInfo[b.guessInfo.length - 1]["distance"];
					return aDistance < bDistance ? -1 : aDistance > bDistance ? 1 : 0;
				});
				if (readyAmount >= GameApp.players.length) {
					//console.log('All players ready');
					this.nextReady();
					ready = true;
				}
			},
			distanceDisplayer: function (input: number): string {
				return distanceDisplayer(input);
			}
		},
		mounted() {
			this.updateScreen();
			//console.log('Player is ready');
			GameApp.Player.updatePlayerData("ready", getGuessInformation());
			this.checkReadyState();
			GameIO.socket.on("userDisconnect", this.checkReadyState);
			GameIO.socket.on("updatePlayerData", (data) => {
				//console.log('Player data update event');
				this.checkReadyState();
				updateMarkers();
				setTimeout(() => {
					updateMarkers();
					this.checkReadyState();
				}, 250);
			});
		}
	});
	var ready: boolean = false;
	export function isReady() {
		return ready;
	}
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

	.button {
		text-align: center;
	}
	.multiNextBtn {
		display: none;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

	.inner-container {
		display: grid;
		grid-template-columns: 1fr 1.2fr 1fr 1fr;
		column-gap: 0.5em;
		margin: 0.5em 0;
		border-bottom: 2px solid var(--primary-accent);
		padding: 0.9em 0;
	}

	.player {
		color: var(--approve);
	}
</style>
