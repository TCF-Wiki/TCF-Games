<template>
	<div class="container">
		<div class="title-container">
			<h1>Fortuna Guessr</h1>
			<p class="subtitle">By The Cycle: Frontier Wiki</p>
		</div>
		<section class="content-container">
			<div class="selector-container" v-if="showControls">
				<DifficultyCard difficulty="Easy" description="A set of locations of easy difficulty, fit for new players. This set only includes Bright Sand locations." image="EasyDifficultyImage.png" mapIcon="false" />
				<DifficultyCard difficulty="Medium" description="A tricky set of locations for people familiar with the game. A decent challenge to test your knowledge." image="MediumDifficultyImage.png" />
				<DifficultyCard difficulty="Hard" description="A set of locations of hard difficulty, good for a difficult challenge for experienced players." image="HardDifficultyImage.png" />
				<DifficultyCard difficulty="Insane" description="An unfair set of locations. Good luck." image="InsaneDifficultyImage.png" />
			</div>
			<section class="options-container">
				<div class="seed-container" v-if="showControls">
					<div class="title-container">
						<h2>Seed</h2>
						<p class="subtitle no-color">This will start a game with the provided seed</p>
					</div>
					<div class="input-field">
						<input type="text" v-model="enteredSeed" placeholder="Game Seed" id="gameSeedInput" />
						<label for="gameSeedInput" class="active"> Enter game seed... </label>
					</div>
					<div class="btn-container">
						<button class="button" type="submit" @click.prevent="startWithSeed()" value="submit">Start Game</button>
					</div>
				</div>
				<MultiplayerLobby />
			</section>
		</section>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import DifficultyCard from "./Start/DifficultyCard.vue";
	import MultiplayerLobby from "./Start/MultiplayerLobby.vue";
	import {App} from "@/multiplayer";

	export default defineComponent({
		name: "Start",
		data: () => ({
			enteredSeed: "" as string,
			showControls: App.host
		}),
		components: {
			DifficultyCard,
			MultiplayerLobby
		},
		methods: {
			startWithSeed() {
				emitter.emit("StartGameWithSeed", this.enteredSeed);
			}
		},
		mounted() {
			console.log(App.host);
			emitter.on("HostChanged", () => {
				this.showControls = App.host;
				console.log(App.host);
			});
		}
	});
</script>

<style scoped lang="less">
	@import url("@/assets/text-input.css");

	h1 {
		font-size: 3rem;
		line-height: 1;
		text-align: center;
		width: 100%;
	}

	.subtitle {
		text-align: center;
		font-size: 0.8rem;
		margin-bottom: var(--space-sm);
		color: var(--color-base--subtle)
	}

	.subtitle.no-color {
		color: var(--color-base)
	}

	.selector-container,
	.options-container {
		display: flex;
		gap: var(--space-lg);
		padding: var(--space-lg);
		flex-wrap: wrap;
		justify-content: center;
	}


	.seed-container {
		border: 1px solid var(--border-color-base);
		padding: var(--space-md);
		min-width: 25rem;

		& h2 {
			text-align: center;
		}

		@media screen and (max-width: 900px) {
			min-width: 100%
		}
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
