<template>
	<main class="container">
		<h1>Showing Guesses</h1>
		<!--This is a temporary test button-->
		<button v-if="showControls" @click="nextRound()">Next Round</button>
		<ShowingGuessesMap />
	</main>
</template>
<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import ShowingGuessesMap from "./ShowingGuesses/ShowingGuessesMap.vue";
	import {App} from "@/multiplayer";

	export default defineComponent({
		name: "ShowingGuesses",
		data: () => ({
			guessData: {} as guessInfoType,
			showControls: App.host
		}),
		methods: {
			nextRound() {
				console.log("Next round");
				emitter.emit("StartNextRound");
			}
		},
		mounted() {
			emitter.on("Guess", (guessData: guessInfoType) => {
				this.guessData = guessData;
			});
			emitter.on("HostChanged", () => {
				this.showControls = App.host;
			});
		},
		components: {ShowingGuessesMap}
	});
</script>
<style scoped></style>
