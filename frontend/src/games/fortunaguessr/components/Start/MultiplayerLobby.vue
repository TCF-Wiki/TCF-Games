<template>
	<Transition name="scale-in" appear>
		<section class="container">
			<div class="title-container">
				<h2>Multiplayer</h2>
				<p class="subtitle" @click="copyRoomId">
					Room ID: <span class="roomID"> {{ currentRoomId }} </span>
				</p>
			</div>
			<div class="content">
				<div class="input-field">
					<input placeholder="Enter room ID..." id="roomID" type="text" class="validate" v-model="roomId" />
					<label for="roomID" class="active">Room ID</label>
				</div>
				<div class="input-field">
					<input placeholder="Enter new username..." id="changeName" type="text" class="validate" v-model="name" />
					<label for="changeName" class="active">Username</label>
				</div>
				<div class="button-container">
					<button class="small-button join" @click="joinRoom">Join room</button>
					<button class="small-button leave" @click="leaveRoom" v-if="playerList.length !== 1">Leave room</button>
					<button class="small-button" @click="changeName">Change name</button>
				</div>
			</div>
		</section>
	</Transition>
	<Transition name="scale-in" appear>
		<section class="container">
			<div class="title-container">
				<h2>Players</h2>
				<p class="subtitle">
					<span class="current-player-amount"> {{ playerList.length }} / 10 </span> players
				</p>
				<ul>
					<li v-for="player in playerList">
						<p> {{ player.name }}</p>
						<button @click="kickPlayer(player)" class="small-button leave" v-if="showControls && playerList.length > 1 && player.socketId != getMySocketId()">Kick</button>
					</li>
				</ul>
			</div>
		</section>
	</Transition>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {app, emitter, toast} from "@/main";

	import "@/games/fortunaguessr/multiplayer";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";

	export default defineComponent({
		name: "TestView",
		data: () => ({
			name: App.myPlayerData.name,
			roomId: "",
			currentRoomId: "",
			playerList: [] as PlayerDataType[],
			showControls: App.host
		}),
		mounted() {
			emitter.on("RoomJoined", (roomId: string) => {
				this.currentRoomId = roomId;
			});
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				this.currentRoomId = App.roomId ?? "";
				this.playerList = players;
			});
			this.currentRoomId = App.roomId ?? "";
			this.playerList = App.playerList ?? [];

			emitter.on("HostChanged", () => {
				this.showControls = App.host;
				console.log(App.host);
			});
		},
		methods: {
			joinRoom() {
				this.changeName();
				if (this.name.length < 16) App.JoinRoom(this.roomId);
			},
			leaveRoom() {
				App.LeaveRoom();
			},
			changeName() {
				if (this.name.length >= 16) {
					toast.error("Names cannot be longer than 15 characters.")
					return;
				}
				App.ChangeName(this.name);
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
		width: 100%;
	}

	li {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: var(--space-md);
	}

	li p {
		display: flex;
		align-items: center;
	}
</style>
