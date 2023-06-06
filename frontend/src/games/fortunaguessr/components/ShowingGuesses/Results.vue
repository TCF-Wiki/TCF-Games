<template>
	<section class="results-container">
		<div class="title-container">
			<h2>Scoreboard</h2>
		</div>
		<div class="content">
			<div class="title-container">
				<table class="wikitable">
					<tr>
						<th>Player</th>
						<th>Status</th>
						<th>Time</th>
						<th v-if="showGuessInfo">Points</th>
						<th v-if="showGuessInfo">Distance</th>
						<th v-if="showGuessInfo">Total score</th>
						<th v-if="showControls">Actions</th>
					</tr>
					<TransitionGroup name="list" v-for="player in playerList" tag="tr">
						<td>{{ player.name }}</td>
						<td>{{ player.status }}</td>
						<td>{{ player.guess && player.guess.time != -1 ? player.guess.time + "s" : "" }}</td>
						<td v-if="showGuessInfo">{{ player.guess ? player.guess.score : 0 }}</td>
						<td v-if="showGuessInfo">{{ player.guess && player.guess.time != -1 ? (player.guess.distance == -1 ? "Wrong map" : player.guess.distance + "m") : "" }}</td>
						<td v-if="showGuessInfo">{{ player.score }}</td>
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button kick" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</TransitionGroup>
				</table>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {app, emitter, toast} from "@/main";

	import "@/games/fortunaguessr/multiplayer";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	export default defineComponent({
		name: "TestView",
		data: () => ({
			playerList: [] as {name: string; socketId: string; score: number; status: string; guess: guessInfoType}[],
			showControls: false
		}),
		props: {
			currentRound: {
				type: Number,
				required: true
			},
			showGuessInfo: {
				type: Boolean,
				required: true
			}
		},
		mounted() {
			this.updateShowControls();
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				this.playerList = this.convertPlayerList();
			});
			this.playerList = this.convertPlayerList();

			emitter.on("HostChanged", () => {
				this.updateShowControls();
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
			convertPlayerList() {
				let playerList: {name: string; socketId: string; score: number; status: string; guess: guessInfoType}[] = [];
				for (let player of App.playerList) {
					let status = "";
					let guess = player.gameData.guesses[this.currentRound];
					if (guess) {
						if (guess.time == -1) {
							status = "Didn't guess";
						} else {
							status = "Guessed";
						}
					} else {
						status = "Guessing...";
					}
					playerList.push({
						name: player.name,
						socketId: player.socketId,
						score: player.gameData.score,
						status: status,
						guess: guess
					});
				}
				playerList.sort((a, b) => {
					if (a.guess) {
						if (b.guess) {
							return b.guess.score - a.guess.score;
						} else {
							return -1;
						}
					} else {
						if (b.guess) {
							return 1;
						} else {
							return 0;
						}
					}
				});
				return playerList;
			}
		}
	});
</script>

<style scoped lang="less">
	@import url("@/assets/text-input.css");

	.results-container {
		border: 1px solid var(--border-color-base);
		padding: var(--space-lg);
		min-width: 25rem;

		background-color: var(--color-surface-3);
		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
		& h2 {
			text-align: center;
		}

		@media screen and (max-width: 900px) {
			max-width: 90vw;
			min-width: unset;
		}
	}

	.small-button {
		padding: var(--space-xs);
		margin: 0;
		width: 100%;
		&.kick {
			background-color: var(--color-destructive);
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.list-enter-active,
	.list-leave-active {
	transition: all 0.5s ease;
	}
	.list-enter-from,
	.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
	}
</style>
