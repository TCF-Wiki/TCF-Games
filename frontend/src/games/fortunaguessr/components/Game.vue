<template>
	<main class="container">
		<h1>Guessing</h1>
		<button @click="guess()">Guess</button>
		<section>
			<GameMap :currentRound="currentRound" />
		</section>
		<section>
			<h2>Image</h2>
			<img :src="'/fortunaguessr/' + location.src" alt="Image" />
		</section>
	</main>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import type {PropType} from "vue";
	import {emitter} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import GameMap from "./Game/GameMap.vue";

	export default defineComponent({
		name: "Guessing",
		data: () => ({}),
		components: {
			GameMap
		},
		props: {
			location: {
				type: Object as PropType<locationType>,
				required: true
			},
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
			currentRound: {
				type: Number,
				required: true
			}
		},
		methods: {
			guess() {
				console.log("Making guess");
				emitter.emit("Guess", {
					lat: 0,
					lng: 0,
					distance: 0,
					score: 0
				});
			}
		},
		mounted() {}
	});
</script>

<style scoped></style>
