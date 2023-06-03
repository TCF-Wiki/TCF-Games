<template>
	<main class="container">
		<h1>Start</h1>
		<section>
			<form class="container">
				<DifficultyCard difficulty="Easy" description="A set of locations of easy difficulty, fit for new players. This set only includes Bright Sand locations." image="EasyDifficultyImage.png" mapIcon="false" />
				<DifficultyCard difficulty="Medium" description="A tricky set of locations for people familiar with the game. A decent challenge to test your knowledge." image="MediumDifficultyImage.png" />
				<DifficultyCard difficulty="Hard" description="A set of locations of hard difficulty, good for a difficult challenge." image="HardDifficultyImage.png" />
				<DifficultyCard difficulty="Insane" description="An unfair set of locations. Good luck." image="InsaneDifficultyImage.png" />
			</form>
			<section class="container second-container">
				<section class="seed-container">
					<h2>Seed</h2>
					<p>
						This will start a game<br />
						with the provided seed
					</p>
					<div class="text-input">
						<input type="text" v-model="enteredSeed" placeholder="Game Seed" id="gameSeedInput" />
						<label for="gameSeedInput"> Game Seed </label>
					</div>
					<div class="btn-container">
						<button class="button" type="submit" @click.prevent="startWithSeed()" value="submit">Start Game</button>
					</div>
				</section>
			</section>
		</section>
	</main>
</template>
<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import DifficultyCard from "./Start/DifficultyCard.vue";

	export default {
		name: "Start",
		data: () => ({
			enteredSeed: "" as string
		}),
		components: {
			DifficultyCard
		},
		methods: {
			startWithSeed() {
				emitter.emit("StartGameWithSeed", this.enteredSeed);
			}
		},
		mounted() {}
	};
</script>
<style scoped>
	@import "@/assets/text-input.css";

	.btn-container {
		position: absolute;
		left: 50%;
		bottom: 1em;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
	}

	.button {
		padding: 0.5em 1em;
	}

	.container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 2em;
		flex-wrap: wrap;
	}

	.second-container {
		margin-top: 2em;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.second-container section {
		padding: 2em 3em 4em;
		max-width: 100%;
	}

	.minor-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1em;
		align-items: center;
	}

	.seed-container {
		border: 0.2em solid var(--primary-accent);
	}
	.map-container {
		border: 0.2em solid var(--primary-accent);
	}

	.minor-container .row {
		flex-direction: column;
		display: flex;
	}

	h2 {
		font-family: Nulshock, sans-serif;
		text-align: center;
	}

	.multiplayer-container {
		border: 2px solid var(--primary-accent);
	}
	#waitingScreen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.seed-container input[type="text"] {
		margin: 0 0.3em;
	}

	.hourglass {
		display: block;
		margin: 3em auto;
		width: 2em;
		height: 4em;
		animation: hourglass 2s linear infinite;
	}

	.outer {
		fill: var(--tertairy);
	}

	.middle {
		fill: #181818;
	}

	@keyframes hourglass {
		0% {
			transform: rotate(0deg);
			box-shadow: inset var(--tertairy) 0 -0em 0 0, inset #181818 0 -2em 0 0, inset var(--tertairy) 0 -4em 0 0;
		}
		80% {
			transform: rotate(0deg);
			box-shadow: inset var(--tertairy) 0 -2em 0 0, inset #181818 0 -2em 0 0, inset var(--tertairy) 0 -2em 0 0;
		}
		100% {
			transform: rotate(180deg);
			box-shadow: inset var(--tertairy) 0 -2em 0 0, inset #181818 0 -2em 0 0, inset var(--tertairy) 0 -2em 0 0;
		}
	}
</style>
