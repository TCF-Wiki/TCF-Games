<template>
	<main class="container">
		<h1>End</h1>
		<button @onclick="restartGame()">Restart Game</button>
		<button @onclick="backToLobby()">Back to Lobby</button>
	</main>
</template>
<script lang="ts">
	export default {
		name: "End",
		data: () => ({}),
		emits: ["restartGame", "backToLobby"],
		methods: {
			restartGame() {
				console.log("Restarting game");
				this.$emit("restartGame");
			},
			backToLobby() {
				console.log("Back to lobby");
				this.$emit("backToLobby");
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
