<template>
	<div>
		<h1>Multiplayer lobby ({{ currentRoomId }})</h1>
		<div class="inputs">
			<div>
				<label>Room to join:</label>
				<input type="text" v-model="roomId" />
			</div>
			<div>
				<button @click="joinRoom">Join room</button>
				<button @click="leaveRoom">Leave room</button>
			</div>
			<div>
				<label>Name: </label>
				<input type="text" v-model="name" />
				<button @click="changeName">Change name</button>
			</div>
		</div>
		<div class="players">
			<h2>Players</h2>
			<ul>
				<li v-for="player in playerList">{{ player.name }}</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";

	import "@/games/fortunaguessr/multiplayer";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";

	export default defineComponent({
		name: "TestView",
		data: () => ({
			name: "Player",
			roomId: "",
			currentRoomId: "",
			playerList: [] as PlayerDataType[]
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
		},
		methods: {
			joinRoom() {
				App.JoinRoom(this.roomId);
			},
			leaveRoom() {
				App.LeaveRoom();
			},
			changeName() {
				App.ChangeName(this.name);
			}
		}
	});
</script>

<style scoped></style>
