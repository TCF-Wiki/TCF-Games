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
import { defineComponent } from 'vue';
import EndMap from './End/EndMap.vue';

export default defineComponent({
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
	mounted() { },
	components: { EndMap }
});
</script>
<style scoped></style>
