<template>
	<section class="container">
		<div class="title-container">
			<h2>Scoreboard</h2>
			<p class="subtitle" @click="copyRoomId">
				Room ID: <span class="roomID"> {{ currentRoomId }} </span>
			</p>
		</div>
		<div class="content">
			<div class="title-container">
				<h2>Players</h2>
				<p class="subtitle">
					<span class="current-player-amount"> {{ playerList.length }} / 10 </span> players
				</p>
				<table>
					<tr>
						<th>Player</th>
						<th>Total score</th>
						<th>Points</th>
						<th>Distance</th>
						<th>Time</th>
						<th>Status</th>
						<th v-if="showControls">Actions</th>
					</tr>
					<tr v-for="player in playerList">
						<td>{{ player.name }}</td>
						<td>{{ player.score }}</td>
						<td>{{ player.guess ? player.guess.score : 0 }}</td>
						<td>{{ player.guess && player.guess.time != -1 ? (player.guess.distance == -1 ? "Wrong map" : player.guess.distance + "m") : "" }}</td>
						<td>{{ player.guess && player.guess.time != -1 ? player.guess.time + "s" : "" }}</td>
						<td>{{ player.status }}</td>
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button leave" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</tr>
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
			currentRoomId: App.roomId ?? "",
			playerList: [] as {name: string; socketId: string; score: number; status: string; guess: guessInfoType}[],
			showControls: false
		}),
		props: {
			currentRound: {
				type: Number,
				required: true
			}
		},
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
			copyRoomId() {
				navigator.clipboard.writeText(this.currentRoomId);
				toast.success("Copied Room ID to clipboard!");
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

	.container {
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

	.subtitle {
		text-align: center;
		font-size: 0.8rem;
		margin-bottom: var(--space-sm);
	}

	.roomID {
		color: var(--color-base--subtle);
		background-color: var(--color-surface-0);
		border: 1px solid var(--border-color-base);
		border-radius: 3px;
		padding: var(--space-xs);
		cursor: copy;
	}

	.current-player-amount {
		color: var(--color-base--subtle);
	}

	.button-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-sm);

		button {
			margin: 0;
		}
	}

	.small-button {
		padding: var(--space-xs);
		margin: 0;

		&.join {
			background-color: var(--color-success);
		}

		&.leave {
			background-color: var(--color-destructive);
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
</style>