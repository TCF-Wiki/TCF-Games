<template>
	<section class="container">
		<h1>Showing Guesses</h1>
		<!--This is a temporary test button-->
		<button v-if="showControls" @click="nextRound()">Next Round</button>
		<ShowingGuessesMap :gameOptions="gameOptions"/>
	</section>
</template>
<script lang="ts">
	import {defineComponent, type PropType} from "vue";
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
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
		},
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
