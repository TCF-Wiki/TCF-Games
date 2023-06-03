<template>
	<main class="container">
		<h1>Guessing</h1>
		<!--This is a temporary test button-->
		<button @click="guess()">Guess</button>
	</main>
</template>
<script lang="ts">
	export default {
		name: "Guessing",
		data: () => ({}),
		emits: ["guess"],
		methods: {
			guess() {
				console.log("Making guess");
				this.$emit("guess", {
					lat: 0,
					lng: 0,
					distance: 0,
					score: 0
				});
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
