<template>
	<section>
		<div class="title-container">
			<h1>Fortuna Guessr</h1>
			<p class="subtitle">By The Cycle: Frontier Wiki</p>
		</div>
		<section class="content-container">
			<div class="container" v-if="showControls">
				<DifficultyCard difficulty="Easy" description="A set of locations of easy difficulty, fit for new players. This set only includes Bright Sands locations." image="EasyDifficultyImage.png" mapIcon="false" />
			</div>
			<div class="container" v-if="showControls">
				<DifficultyCard difficulty="Medium" description="A tricky set of locations for people familiar with the game. A decent challenge to test your knowledge." image="MediumDifficultyImage.png" />
			</div>
			<div class="container" v-if="showControls">
				<DifficultyCard difficulty="Hard" description="A set of locations of hard difficulty, good for a difficult challenge for experienced players." image="HardDifficultyImage.png" />
			</div>
			<div class="container" v-if="showControls">
				<DifficultyCard difficulty="Insane" description="An unfair set of locations. Good luck." image="InsaneDifficultyImage.png" />
			</div>
			<div class="container" v-if="showControls">
				<Transition name="scale-in" appear>
					<div class="seed-container">
						<div class="title-container">
							<h2>Seed</h2>
							<p class="subtitle no-color">This will start a game with the provided seed</p>
						</div>
						<div class="input-field">
							<input type="text" v-model="enteredSeed" placeholder="Enter game seed..." id="gameSeedInput" />
							<label for="gameSeedInput" class="active"> Game seed </label>
						</div>
						<div class="btn-container">
							<button class="button" type="submit" @click.prevent="startWithSeed()" value="submit">Start Game</button>
						</div>
					</div>
				</Transition>
			</div>
			<!-- <section class="options-containerd"> -->
			<div class="container">
				<MultiplayerLobby />
			</div>
			<div class="container">
				<PlayerList />
			</div>
			<!-- </section> -->
		</section>
	</section>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import DifficultyCard from "./Start/DifficultyCard.vue";
	import MultiplayerLobby from "./Start/MultiplayerLobby.vue";
	import PlayerList from './Start/PlayerList.vue'
	import {App} from "@/multiplayer";

	export default defineComponent({
		name: "Start",
		data: () => ({
			enteredSeed: "" as string,
			showControls: App.host
		}),
		components: {
			DifficultyCard,
			MultiplayerLobby,
			PlayerList
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

	.content-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: var(--space-lg);
		max-width: 100%;
		margin: 0 2rem; 

		@media screen and (max-width: 1500px) {
			grid-template-columns: 1fr 1fr 1fr;
		}

		@media screen and (max-width: 1150px) {
			grid-template-columns: 1fr 1fr;
		}

		@media screen and (max-width: 900px) {
			grid-template-columns: 1fr;
			margin: 0 .5rem
		}

		& .container {
			width: 100%;
			aspect-ratio: 1 / 1;
		}
	}

	.seed-container {
		border: 1px solid var(--border-color-base);
		padding: var(--space-lg);
		width: 100%;
		aspect-ratio:  1 /1;

		background-color: var(--color-surface-3);
		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

		& h2 {
			text-align: center;
		}
	}

	.title-container {
		display: flex;
		justify-content: center;
		max-width: 100%;
		flex-direction: column;
	}
	h1 {
		font-size: 3rem;
		font-weight: bold;
		line-height: 1;
		text-align: center;

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

	.btn-container {
		margin-top: var(--space-sm);
		display: flex;
		justify-content: center;

		& .button {
			background-color: var(--color-success);
			width: 50%;
			margin: 0;
		}
	}
</style>
