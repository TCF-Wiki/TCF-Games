<template>
	<section class="container">
		<div class="title-container">
			<h1>Results for round {{ currentRound + 1 }}</h1>
			<button v-if="showControls" @click="nextRound()">Next Round</button>
		</div>
		<div class="guess-container">
			<Transition name="scale-in" appear v-if="showGuesses">
				<ShowingGuessesMap :gameOptions="gameOptions" :currentRound="currentRound" :location="location" />
			</Transition>
			<div v-else>
				<Transition name="scale-in" appear>
					<h2>Waiting for everyone to guess...</h2>
				</Transition>
			</div>
			<Transition name="scale-in" appear>
				<Results :currentRound="currentRound" :show-guess-info="showGuesses" />
			</Transition>
		</div>
	</section>
</template>
<script lang="ts">
	import {defineComponent, type PropType} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import ShowingGuessesMap from "./ShowingGuesses/ShowingGuessesMap.vue";
	import Results from "./ShowingGuesses/Results.vue";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";

	export default defineComponent({
		name: "ShowingGuesses",
		data: () => ({
			guessData: {} as guessInfoType,
			showControls: false,
			playerList: [] as PlayerDataType[]
		}),
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
			currentRound: {
				type: Number,
				required: true
			},
			location: {
				type: Object as PropType<locationType>,
				required: true
			}
		},
		computed: {
			showGuesses(): boolean {
				for (let player in this.playerList) {
					if (!this.playerList[player].gameData?.guesses[this.currentRound]) {
						console.log("Player " + this.playerList[player].name + " has not guessed yet");
						return false;
					}
				}
				console.log("Everyone has guessed");
				return true;
			}
		},
		methods: {
			nextRound() {
				console.log("Next round");
				emitter.emit("StartNextRound");
			},
			checkControl() {
				//Check if host
				if (!App.host) {
					this.showControls = false;
				} else {
					//Check if everyone has guessed
					let everyoneGuessed = true;
					for (let i = 0; i < this.playerList.length; i++) {
						if (this.playerList[i].gameData.guesses.length != App.myPlayerData.gameData.guesses.length) {
							everyoneGuessed = false;
							break;
						}
					}
					this.showControls = everyoneGuessed;
				}
			}
		},
		mounted() {
			this.playerList = App.playerList;
			console.log(this.playerList);
			this.checkControl();
			emitter.on("Guess", (guessData: guessInfoType) => {
				this.guessData = guessData;
			});
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				this.playerList = players;
				console.log(this.playerList);
				this.checkControl();
			});
			emitter.on("HostChanged", () => {
				this.checkControl();
			});
		},
		components: {ShowingGuessesMap, Results}
	});
</script>
<style scoped lang="less">
	.container {
		max-width: calc(97vw - 2.8 * var(--padding-page));
		margin: 0 2rem;
	}

	.guess-container {
		max-width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-lg);

		@media screen and (max-width: 900px) {
			grid-template-columns: 1fr;
		}
	}

	h1 {
		text-align: center;
		width: 100%;
		font-size: 2.5rem;
	}

	.title-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 2rem;
	}
</style>
