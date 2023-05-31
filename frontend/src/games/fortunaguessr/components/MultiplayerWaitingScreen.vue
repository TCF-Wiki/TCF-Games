<template>
	<div class="outer-container">
		<div class="container">
			<h2>{{ title }}</h2>
		</div>
		<div class="inner-container">
			<h2 v-if="showRoomId">{{ "Room " + gameId }}</h2>
			<h2 v-if="!showRoomId">Room ID Hidden</h2>
			<button class="button" @click.prevent="copyJoinLink">Copy Join Link</button>
		</div>
		<div>
			<h2>Players currently in room:</h2>
			<span v-for="(player, index) in players" class="playerName"> {{ index != 0 ? ", " + player.playerName : player.playerName }} </span>
		</div>
		<div class="close-game">
			<button class="button" @click.prevent="leaveRoom()">{{ buttonTitle }}</button>
		</div>
	</div>
</template>
<script lang="ts">
	import {GameIO, GameApp} from "../multiplayer";
	import {defineComponent} from "vue";
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;

	export default defineComponent({
		name: "MultiplayerWaiting",
		data: function () {
			return {
				enteredSeed: "",
				gameId: GameApp.App.gameId,
				name: GameApp.Player.myName,
				players: new Array(),
				title: "",
				buttonTitle: "",
				showRoomId: true
			};
		},
		methods: {
			waitingScreen(data: any) {
				this.gameId = GameApp.App.gameId;
				this.name = GameApp.Player.myName;
				this.players = new Array();
				GameApp.players.forEach((player) => {
					this.players.push(player);
				});
				if (GameApp.App.myRole == "Host") {
					this.title = "Start a game once all players have joined";
					this.buttonTitle = "Close Game";
				} else {
					this.title = "Please wait for the host to start the game";
					this.buttonTitle = "Leave Game";
				}
			},
			leaveRoom() {
				if (GameApp.App.myRole == "Host") {
					GameApp.App.Host.onCloseClick();
				} else {
					GameApp.Player.onLeaveClick();
				}
			},
			kick(socketId: string) {
				//console.log('Kick ' + socketId);
			},
			playerData(data: any) {
				if (data instanceof Array) {
					this.players = new Array();
					data.forEach((player) => {
						this.players.push(player);
					});
				} else {
					this.players.push(data);
				}
				//console.log(App.players);
				//console.log('Data received!');
			},
			refreshPlayers() {
				//console.log('Refreshing player list');
				//console.log(App.players);
				this.players = new Array();
				GameApp.players.forEach((player) => {
					this.players.push(player);
				});
			},
			copyJoinLink() {
				let url = window.location.toString() + `?join=` + this.gameId;
				navigator.clipboard.writeText(url.toString()).then(() => {
					toast.success("Copied link to clipboard");
				});
			}
		},
		mounted() {
			this.waitingScreen(null);
			let displayRoomId = window.localStorage.getItem("displayRoomId");
			if (displayRoomId) {
				if (displayRoomId == "true") {
					this.showRoomId = true;
				} else {
					this.showRoomId = false;
				}
			}
			//console.log(this.showRoomId)
			if (GameApp.App.myRole == "Host") {
				GameIO.socket.on("playerJoinedRoom", this.playerData);
			}
			GameIO.socket.on("roomPlayerData", this.playerData);
			GameIO.socket.on("userDisconnect", this.refreshPlayers);
		}
	});
</script>

<style scoped>
	.outer-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		border: 2px solid var(--primary-accent);
		padding: 2em;
	}
	.outer-container div {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}

	.inner-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: 0.5em;
		margin: 0.5em 0;
		padding: 0.9em 0;
	}

	.inner-container span {
		margin: auto 0;
	}
	.player-container {
		width: 100%;
	}

	.inner-container .button {
		padding: 0.1em 0.2em;
		margin-left: auto;
	}

	.container {
		display: flex;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1em;
	}

	.close-game {
		margin-left: auto;
	}
</style>
