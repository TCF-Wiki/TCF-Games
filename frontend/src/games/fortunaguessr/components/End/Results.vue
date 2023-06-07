<template>
	<section class="results-container">
		<div class="title-container">
			<h2 class="first">Scoreboard</h2>
		</div>
		<div class="content">
			<div>
				<table class="wikitable">
					<tr>
						<th>Player</th>
						<th>Points</th>
						<th>Distance</th>
						<th>Time</th>
						<th v-if="showControls">Actions</th>
					</tr>
					<tr v-for="player in playerList">
						<td>{{ player.name }}</td>
						<td>{{ player.score }}</td>
						<td>{{ totalDistance(player) }}m</td>
						<td>{{ totalTime(player) }}s</td>
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button kick" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</tr>
				</table>
			</div>
			<hr />
			<div>
				<h2>View results for a specific round </h2>
				<div class="input-container"> 
					<label for="roundInput"> Round </label>
					<input type="number" id="roundInput" :max="rounds" :min="1" v-model="selectedRound" />
					<div class="input-buttons">
						<span @click="selectedRound = Math.min(rounds, selectedRound +1)" role="button"> + </span>
						<span @click="selectedRound = Math.max(0, selectedRound - 1)" role="button"> - </span>
					</div>
				</div>
				<table class="wikitable">
					<tr>
						<th>Player</th>
						<th>Points</th>
						<th>Distance</th>
						<th>Time</th>
						<th v-if="showControls">Actions</th>
					</tr>
					<tr v-for="player in playerList">
						<td>{{ player.name }}</td>
						<td>{{ player.guesses[selectedRound - 1].score }}</td>
						<td>{{ player.guesses[selectedRound - 1].time != -1 ? (player.guesses[selectedRound - 1].distance == -1 ? "Wrong map" : player.guesses[selectedRound - 1].distance + "m") : "" }}</td>
						<td>{{ player.guesses[selectedRound - 1].time != -1 ? player.guesses[selectedRound - 1].time + "s" : "" }}</td>
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button kick" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</tr>
				</table>
			</div>
			<hr />
			<div>
				<h2> Continue </h2> 
				<div class="button-container">
					<button @click="restartGame()" class="restart" v-if="showButtons">Restart Game</button>
					<button @click="backToLobby()" v-if="showButtons">Back to Start</button>
					<button @click="leaveRoom" class="leave"  v-if="playerList.length !== 1">Leave room</button>
				</div>
				<p class="seed">
					Seed: {{ gameOptions.seed }}
				</p>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import {defineComponent, type PropType} from "vue";
	import {app, emitter, toast} from "@/main";

	import "@/games/fortunaguessr/multiplayer";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";
	import { GameApp } from "@/games/fortunaguessr/multiplayer";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	export default defineComponent({
		name: "TestView",
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
		},
		data: () => ({
			currentRoomId: App.roomId ?? "",
			playerList: [] as {name: string; socketId: string; score: number; guesses: guessInfoType[]}[],
			showControls: false,
			showButtons: App.host,
			showCurrentRoomId: (() => {
				let storage = localStorage.getItem("showCurrentRoomId");
				if (storage != null) {
					return storage === "true";
				} else {
					return true;
				}
			})(),
			selectedRound: 1,
			rounds: App.myPlayerData.gameData.guesses.length
		}),
		mounted() {
			this.updateShowControls();
			emitter.on("RoomJoined", (roomId: string) => {
				this.currentRoomId = roomId;
			});
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				this.currentRoomId = App.roomId ?? "";
				this.playerList = this.convertPlayerList();
			});
			this.currentRoomId = App.roomId ?? "";
			this.playerList = this.convertPlayerList();

			emitter.on("HostChanged", () => {
				this.updateShowControls();
				this.showButtons = App.host
			});
		},
		methods: {
			updateShowControls() {
				this.showControls = false;
				if (App.host) {
					if (App.playerList.length > 1) {
						this.showControls = true;
					}
				}
			},
			getMySocketId() {
				return App.myPlayerData.socketId;
			},
			kickPlayer(player: PlayerDataType) {
				App.KickPlayer(player.socketId);
			},
			restartGame() {
				console.log("Restarting game");
				emitter.emit("StartGameWithOptions", null);
			},
			backToLobby() {
				console.log("Back to lobby");
				GameApp.SendBackToLobby();
			},
			leaveRoom() {
				App.LeaveRoom();
			},
			copyRoomId() {
				navigator.clipboard.writeText(this.currentRoomId);
				toast.success("Copied Room ID to clipboard!");
			},
			convertPlayerList() {
				let playerList: {name: string; socketId: string; score: number; guesses: guessInfoType[]}[] = [];
				for (let player of App.playerList) {
					playerList.push({
						name: player.name,
						socketId: player.socketId,
						score: player.gameData.score,
						guesses: player.gameData.guesses
					});
				}
				playerList.sort((a, b) => {
					return b.score - a.score;
				});
				return playerList;
			},
			changeStreamerMode() {
				this.showCurrentRoomId = !this.showCurrentRoomId;
				localStorage.setItem("showCurrentRoomId", this.showCurrentRoomId.toString());
			},
			totalTime(player: any) : number {
				let total = 0;
				for (let round in player.guesses) {
					if (player.guesses[round].time != -1) total += player.guesses[round].time
					else total += this.gameOptions.timeLimit
				}
				return total;
			},
			totalDistance(player: any) : number {
				let total = 0;
				for (let round in player.guesses) {
					if (player.guesses[round].distance != 0) total += player.guesses[round].distance
					else total += 0
				}
				return total;
			}
		},
		watch: {
			selectedRound() {
				if (this.selectedRound > this.rounds) this.selectedRound = this.rounds;
				if (this.selectedRound < 1) this.selectedRound = 1;
			}
		}
	});
</script>

<style scoped lang="less">
	@import url("@/assets/text-input.css");

	.results-container {
		border: 1px solid var(--border-color-base);
		padding: var(--space-lg);
		width: 100%;
		aspect-ratio: 1 / 1;

		background-color: var(--color-surface-3);
		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
		transition: border-color .2s ease;
		&:hover {
			border-color: var(--border-color-input--hover);
		}

		& h1 {
			text-align: center;
			font-size: 2.5rem;
		}

		& h2 {
			text-align: center;
			font-size: 2rem;
			margin-top: 1rem;
			margin-bottom: .5rem;
		}

		h2.first {
			margin-top: 0rem;
		}
	}

	.subtitle {
		text-align: center;
		font-size: 0.8rem;
		margin-bottom: var(--space-sm);
	}

	.small-button {
		padding: var(--space-xs);
		margin: 0;

		&.kick {
			background-color: var(--color-destructive);
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	hr {
		margin-top: 2rem;
	}
	.input-container {
		height: 2rem;
		text-align: center;
		margin-bottom: var(--space-md);
	
		label {
			display: inline-block;
			translate: 0 -3px;
			margin-right: .25rem;
		}
		input[type="number"] {
  			-moz-appearance: textfield;
			appearance: textfield;
			background-color: var(--color-surface-2);
			border: 1px solid var(--border-color-base);
			border-top-left-radius: 1rem;
			border-bottom-left-radius: 1rem;
			color: var(--color-base);
			width: 2rem;
			font-size: 1.5rem;
			padding: var(--space-sm);
			height: 100%;
			translate: 0 -2px;
		}
		
		input[type="number"]::-webkit-inner-spin-button, 
		input[type="number"]::-webkit-outer-spin-button { 
			-webkit-appearance: none; 
			margin: 0; 
		}

		.input-buttons {
			display: inline-flex;
			height: 100%;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
			span {
				background-color: var(--color-surface-2);
				width: 2rem;
				color: var(--color-base--subtle);
				padding: var(--space-sm);
				font-size: 2rem;
				
				display: flex;
				justify-content: center;
				align-items: center;
				border: 1px solid var(--border-color-base)
			}

			span:first-of-type {
				border-right: 1px solid var(--border-color-base);
			}

			span:last-of-type {
				border-top-right-radius: 1rem;
				border-bottom-right-radius: 1rem;
			}
		}
	}
	.button-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		gap: var(--space-lg);

		button {
			margin: 0;
			width: 100%;

			.restart {
				background-color: var(--color-success);
			}
			.join {
				background-color: var(--color-destructive);
			}
		}
	}
	.seed {
		margin: var(--space-md) 0;
		text-align: center;
		font-size: .8rem;
	}
</style>
