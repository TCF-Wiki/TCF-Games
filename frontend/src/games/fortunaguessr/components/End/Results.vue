<template>
	<section class="container">
		<div class="title-container">
			<h2>Scoreboard</h2>
			<div class="subtitle">
				<span>Room ID:</span>
				<span class="roomID" @click="copyRoomId">
					{{ showCurrentRoomId ? currentRoomId : "*********" }}
				</span>
				<div @click="changeStreamerMode" class="show-streamer-mode">
					<div v-if="showCurrentRoomId">
						<svg xmlns="http://www.w3.org/2000/svg" height="1em"
							viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
							<path
								d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
						</svg>
					</div>
					<div v-else>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em"
							viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
							<path
								d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="title-container">
				<h2>Players</h2>
				<p class="subtitle">
					<span class="current-player-amount"> {{ playerList.length }} / 10 </span> players
				</p>
			</div>
			<div>
				<h3>Final results</h3>
				<table class="wikitable">
					<tr>
						<th>Player</th>
						<th>Total points</th>
						<th>Total time</th>
						<th>Total distance</th>
						<th v-if="showControls">Actions</th>
					</tr>
					<tr v-for="player in playerList">
						<td>{{ player.name }}</td>
						<td>{{ player.score }}</td>
						<td>{{ totalTime(player) }}s</td>
						<td>{{ totalDistance(player) }}m</td>
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button leave" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</tr>
				</table>
			</div>
			<div>
				<h3>Round <input type="number" :max="rounds" :min="1" v-model="selectedRound" /></h3>
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
						<td v-if="showControls"><button @click="kickPlayer(player)" class="small-button leave" v-if="player.socketId != getMySocketId()">Kick</button></td>
					</tr>
				</table>
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
