<template>
	Test view
	<input type="text" v-model="roomId" />
	<button @click="joinRoom">Join room</button>
	<button @click="leaveRoom">Leave room</button>

	<p>Current room: {{ currentRoomId }}</p>
	<input type="text" v-model="name" />
	<button @click="changeName">Change name</button>

	<div>
		<h2>Players</h2>
		<p v-for="player in playerList">{{ player.name }}</p>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter} from "@/main";
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;

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
				console.log(players);
				this.currentRoomId = App.roomId ?? "";
				this.playerList = players;
			});
		},
		methods: {
			joinRoom() {
				emitter.emit("JoinRoom", this.roomId);
			},
			leaveRoom() {
				emitter.emit("LeaveRoom");
			},
			changeName() {
				emitter.emit("ChangeName", this.name);
			}
		}
	});
</script>

<style scoped></style>
