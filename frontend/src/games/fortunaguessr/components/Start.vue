<template>
	<main class="container">
		<h1>Start</h1>
		<button @click="startGame()">Start</button>
	</main>
</template>
<script lang="ts">
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	export default {
		name: "Start",
		data: () => ({
			options: {
				length: 5,
				difficulty: 1,
				timeLimit: 60,
				maps: [1, 2, 3],
				seed: ""
			} as gameInfoType
		}),
		emits: ["startGame"],
		methods: {
			startGame() {
				this.$emit("startGame", this.options);
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
