<template>
	<main class="container">
		<h1>Showing Guesses</h1>
		<!--This is a temporary test button-->
		<button @click="nextRound()">Next Round</button>
	</main>
</template>
<script lang="ts">
	export default {
		name: "ShowingGuesses",
		data: () => ({}),
		emits: ["nextRound"],
		methods: {
			nextRound() {
				console.log("Next round");
				this.$emit("nextRound");
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
