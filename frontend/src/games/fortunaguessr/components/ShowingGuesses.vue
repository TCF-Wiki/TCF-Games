<template>
	<section class="container">
		<div class="title-container">
			<h1>Results for round {{ currentRound + 1 }}</h1>
			<button v-if="showControls" @click="nextRound()">{{ currentRound+1 >= gameOptions.length ? 'Final results' : 'Next Round' }} </button>
		</div>
		<div class="guess-container">
			<Transition name="scale-in" appear>
				<Results :currentRound="currentRound" :show-guess-info="showGuesses" />
			</Transition>
			<Transition name="scale-in" appear v-if="showGuesses">
				<ShowingGuessesMap :gameOptions="gameOptions" :currentRound="currentRound" :location="location" />
			</Transition>
			<div v-else>
				<Transition name="scale-in" appear>
					<h2>Waiting for everyone to confirm their guess.</h2>
				</Transition>
			</div>
			
		</div>
	</section>

	<Teleport to="body">
		<div class="modal__bg" v-if="showGuesses && feedbackMessage">
			<div class="modal-content">
				<p class="main-text"> {{ score }} pts </p>
				<p class="small-text">out of 5000</p>
				<p class="subtitle"> {{ feedbackMessage }} </p>
			</div>
		</div>
	</Teleport>
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
			playerList: [] as PlayerDataType[],
			feedbackMessage: "",
			score: 0
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
			},
			getOwnScore() {
				console.log('Here is my player data!!', App.myPlayerData.gameData)
				const score = App.myPlayerData.gameData?.guesses[this.currentRound].score;

				const gameScores = {
					perfect: [
						"Perfect score! Are you a Co-Bot?",
						"Flawless victory! Are you even human?",
						"You crushed it! Are you cheating?",
						"Unstoppable! Can I borrow some of your prospecting skills?",
						"Congratulations, you aced it! Did you sell your soul to Badum?",
						"You're a prospecting prodigy! Can I have your autograph?",
						"Masterful performance! Did you secretly train with ninjas?",
						"You're on fire! Did you hire an Osiris Scientist?"
					],
					good: [
						"Great job! You might be ready for the minor leagues.",
						"Well done! You've earned the right to call yourself a prospector.",
						"Impressive! Keep this up, and you might go pro.",
						"You're getting the hang of it! Your opponents should be afraid.",
						"Solid performance! Are you sure you're not a secret prospector celebrity?",
						"Keep it up! The gaming world bows to your skills.",
						"You're making progress! One day, you might even win a participation trophy.",
						"Nice work! You're officially a prospecting virtuoso."
					],
					medium: [
						"Not bad, but you can do better! Or maybe not...",
						"Decent effort! You're the definition of average.",
						"You're getting there! But there's still a long way to go.",
						"Room for improvement! Are you up for the challenge?",
						"Keep practicing! Someday you might reach mediocrity.",
						"You're on the right track! If the right track leads to mediocrity...",
						"Not too shabby! I mean, it's not impressive, but it's something.",
						"Good try! You're just a few thousand hours away from greatness."
					],
					bad: [
						"Better luck next time! Or maybe try a different hobby...",
						"Ouch, that didn't go well! Have you considered knitting instead?",
						"Are you okay? I can recommend some gaming therapy.",
						"You'll get 'em next time! Unless they're actual professionals.",
						"Don't give up! Unless gaming is just not your thing.",
						"It happens to the best of us! But probably more to you.",
						"Keep trying! Maybe gaming just isn't your calling in life.",
						"Practice makes perfect! Or in your case, practice makes less terrible."
					]
				};

				let list;
				if (score == 5000) list = gameScores.perfect;
				else if (score >= 3500) list = gameScores.good;
				else if (score >= 1000) list = gameScores.medium;
				else list = gameScores.bad;

				this.feedbackMessage = list[Math.floor(Math.random() * list.length)];
				this.score = score;
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
				this.getOwnScore()
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
		max-width: 100%;
		margin: 0 2rem;
		
		@media screen and (max-width: 900px) {
			max-width: 100%;
			margin: 0 .5rem
		}
	}

	.guess-container {
		max-width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: calc(2 * var(--space-xl));

		@media screen and (max-width: 1100px) {
			grid-template-columns: 1fr;
		}
	}

	h1 {
		text-align: center;
		width: 100%;
		font-size: 2.5rem;
	}

	h2 {
		text-align: center;
	}

	.title-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 2rem;
	}

	.modal__bg {
		animation: vanish 4s forwards;
		pointer-events: none;

		@media screen and (min-width: 901px) {
			translate: calc(2.8*var(--padding-page)) 0;
		}
	}

	@keyframes vanish {
		0% {
			scale: 0;
		}
		10% {
			scale: 1
		}
		75% {
			opacity: 0.8;
		}
		100% {
			opacity: 0;
		}
	}
	.modal-content {
		text-align: center;
	}

	.modal-content .main-text {
		font-size: 10vw;
		line-height: 10vw;
	}

	.modal-content .small-text {
		font-size: 1.5vw;
	}

	.modal-content .subtitle {
		font-size: 2vw;
		color: var(--color-base--subtle);
	}
</style>
