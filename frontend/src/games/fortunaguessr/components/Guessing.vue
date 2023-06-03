<template>
	<main class="container">
		<h1>Guessing</h1>
		<!--This is a temporary test button-->
		<button @click="guess()">Guess</button>
		<!--Temporary-->
		<p>{{ location.src }}</p>
	</main>
</template>
<script lang="ts">
	import type {PropType} from "vue";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	export default {
		name: "Guessing",
		data: () => ({
			guessInfo: {} as guessInfoType
		}),
		props: {
			location: {
				type: Object as PropType<locationType>,
				required: true
			},
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			}
		},
		emits: ["guess"],
		methods: {
			guess() {
				console.log("Making guess");
				this.$emit("guess", this.guessInfo);
			}
		},
		mounted() {}
	};
</script>
<style scoped></style>
