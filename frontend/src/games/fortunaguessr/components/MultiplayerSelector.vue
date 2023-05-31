<template>
	<section>
		<h2>Host Game</h2>
		<div class="container">
			<div class="row center">
				<p>
					This will host a game which<br />
					other players can join
				</p>
			</div>
		</div>
		<div class="btn-container">
			<button class="button" type="button" @click="hostCreateGame">Host Game</button>
		</div>
	</section>

	<section>
		<h2>Join Game</h2>
		<p>
			This will join a game <br />
			with the provided room ID
		</p>
		<div class="row center">
			<form autocomplete="off">
				<div class="text-input">
					<input id="gameIdInput" type="text" v-model="gameId" placeholder="Game ID" required />
					<label for="gameIdInput">Room ID</label>
				</div>
				<div class="text-input">
					<input id="playerNameInput" type="text" v-model="name" placeholder="Username" required minlength="3" />
					<label for="playerNameInput"> Username </label>
				</div>
			</form>
		</div>
		<div class="btn-container">
			<button class="button" type="submit" @click="joinGame">Join Game</button>
		</div>
	</section>
</template>

<script lang="ts">
	import {GameIO, GameApp} from "../multiplayer";
	import {defineComponent} from "vue";
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;
	interface playerTypes {
		playerName: string;
		gameId: number;
		mySocketId: string;
	}

	function testFunction() {
		//console.log(App.gameId);
	}

	export default defineComponent({
		name: "MultiplayerSelector",
		data: function () {
			return {
				gameId: GameApp.App.gameId != "0" ? GameApp.App.gameId : "",
				players: new Array<playerTypes>(),
				name: ""
			};
		},
		methods: {
			hostCreateGame: function () {
				GameApp.Host.onCreateClick();
				toast.success("Succesfully created a room");
			},
			joinGame: function () {
				GameApp.Player.onJoinClick(Number(this.gameId), this.name);
			},
			updateScreen: function (data: any) {
				this.gameId = GameApp.App.gameId;
				this.players.push(data);
				//console.log(data);
				if (data["playerName"] != "Host") {
					toast.success("A player joined the room");
				}
			},
			successFullyJoinedRoom: function () {
				toast.success("Successfully joined the room");
			}
		},
		mounted() {
			GameIO.socket.on("successfullyJoinedRoom", this.successFullyJoinedRoom);
			GameIO.socket.on("newGameCreated", this.updateScreen);
			GameIO.socket.on("playerJoinedRoom", this.updateScreen);
		}
	});
</script>

<style scoped>
	@import "@/assets/text-input.css";

	.container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1em;
		padding: 1em;
	}

	.container .row {
		flex-direction: column;
		display: flex;
	}

	section {
		border: 0.2em solid var(--primary-accent);
		padding: 2em 3em 4em;
		max-width: 100%;
		position: relative;
	}
	.btn-container {
		position: absolute;
		left: 50%;
		bottom: 1em;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
	}

	h2 {
		font-family: Nulshock, sans-serif;
		text-align: center;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.button {
		align-self: end;
		padding: 0.5em 1em;
	}
</style>
