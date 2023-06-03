<template>
	<main class="container">
		<h1>Start</h1>
		<!--This is a temporary test button-->
		<button @click="startGame('Test', 5, 60)">Start</button>
	</main>
</template>
<script lang="ts">
	export default {
		name: "Start",
		data: () => ({}),
		emits: ["startGame"],
		methods: {
			startGame(seed: string, rounds: number, roundTime: number) {
				console.log("Starting game with seed " + seed + " and " + rounds + " rounds of " + roundTime + " seconds each.");
				this.$emit("startGame", {
					seed: seed,
					rounds: rounds,
					roundTime: roundTime
				});
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
