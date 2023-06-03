<template>
	<main class="container">
		<h1>End</h1>
		<EndMap />
		<!--These are temporary test buttons-->
		<button @click="restartGame()">Restart Game</button>
		<button @click="backToLobby()">Back to Lobby</button>
	</main>
</template>
<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import EndMap from "./End/EndMap.vue";

	export default defineComponent({
		name: "End",
		data: () => ({}),
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
		mounted() {},
		components: {EndMap}
	});
</script>
<style scoped></style>
