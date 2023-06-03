<template>
	<main class="container">
		<h1>Showing Guesses</h1>
		<!--This is a temporary test button-->
		<button @click="nextRound()">Next Round</button>
		<ShowingGuessesMap />
	</main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import ShowingGuessesMap from './ShowingGuesses/ShowingGuessesMap.vue';

export default defineComponent({
	name: "ShowingGuesses",
	data: () => ({}),
	emits: ["nextRound"],
	methods: {
		nextRound() {
			console.log("Next round");
			this.$emit("nextRound");
		}
	},
	mounted() { },
	components: { ShowingGuessesMap }
});
</script>
<style scoped></style>
