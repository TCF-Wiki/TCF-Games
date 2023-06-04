<template>
	<main class="container">
		<h1>End</h1>
		<EndMap />
		<button @click="restartGame()" v-if="showControls">Restart Game</button>
		<button @click="backToLobby()" v-if="showControls">Back to Lobby</button>
	</main>
</template>
<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import EndMap from "./End/EndMap.vue";
	import {App} from "@/multiplayer";

	export default defineComponent({
		name: "End",
		data: () => ({
			showControls: App.host
		}),
		methods: {
			restartGame() {
				console.log("Restarting game");
				emitter.emit("StartGameWithOptions", null);
			},
			backToLobby() {
				console.log("Back to lobby");
				emitter.emit("BackToLobby");
			}
		},
		mounted() {
			emitter.on("HostChanged", () => {
				this.showControls = App.host;
			});
		},
		components: {EndMap}
	});
</script>
<style scoped></style>
