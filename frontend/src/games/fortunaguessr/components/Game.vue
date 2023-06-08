<template>
	<section class="container">
		<div class="header">
			<div id="countdown" :style="{'--countdown-length': gameOptions.timeLimit.toString() + 's', '--color': countDownColor, '--color-pulse': pulseColor}">
				<div id="countdown-number">{{ countdownNumber }}</div>
				<br />
				<div class="round-number-container">{{ currentRound + 1 }} / {{ gameOptions.length }}</div>
				<svg>
					<circle r="36" cx="40" cy="40"></circle>
				</svg>
			</div>
		</div>
		<div class="button-container">
			<button type="button" @click="guess" :disabled="JSON.stringify(currentGuess) == '{}'">Confirm Guess</button>
		</div>
		<section class="game-container">
			<div>
				<Transition name="scale-in" appear>
					<div v-if="!isTimeUp">
						<img class="game-image" v-if="!isTimeUp" :src="'/fortunaguessr/' + location.src" alt="Image" />
						<p class="subtitle">ID: {{ location.src.replace(".webp", "") }}</p>
					</div>
				</Transition>
			</div>
			<div>
				<Transition name="scale-in" appear>
					<div>
						<GameMap :gameOptions="gameOptions" :isTimeUp="isTimeUp" :currentRound="currentRound" />
					</div>
				</Transition>
			</div>
		</section>
	</section>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import type {PropType} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import GameMap from "./Game/GameMap.vue";
	import {GameApp} from "../multiplayer";
	import {App} from "@/multiplayer";

	export default defineComponent({
		name: "Guessing",
		data: () => ({
			showControls: App.host,
			countdownNumber: 0,
			countDownColor: "var(--color-base--emphasized)",
			pulseColor: "var(--color-base--emphasized)",
			isTimeUp: false,
			currentGuess: {} as any,
			hasGuessed: false
		}),
		components: {
			GameMap
		},
		props: {
			location: {
				type: Object as PropType<locationType>,
				required: true
			},
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
			currentRound: {
				type: Number,
				required: true
			}
		},
		methods: {
			guess() {
				if (this.hasGuessed) return;
				console.log("Making guess");
				if (JSON.stringify(this.currentGuess) == "{}" || !this.currentGuess) {
					toast.info("You have not placed a guess yet.");
					return;
				}
				emitter.emit("Guess", {
					location: [this.currentGuess.lat, this.currentGuess.lng],
					map: this.currentGuess.map,
					round: this.currentRound,
					time: this.gameOptions.timeLimit - this.countdownNumber,
					imageData: this.location,
					// add scoring here (calculated in backend)
					distance: 0,
					score: 0
				} as guessInfoType);

				this.hasGuessed = true;
			}
		},
		mounted() {
			console.log(this.$props);
			console.log(this.location);
			this.countdownNumber = this.gameOptions.timeLimit;
			emitter.on("HostChanged", () => {
				if (GameApp.state != "Guessing") return;
				this.showControls = App.host;
			});

			const frame = this;
			const timer = setInterval(function () {
				frame.countdownNumber = Math.max(0, --frame.countdownNumber);
				if (frame.countdownNumber <= 10) {
					frame.countDownColor = "var(--color-destructive)";
					frame.pulseColor = "var(--color-base--subtle)";
				}
				if (frame.countdownNumber <= 0) {
					clearInterval(timer);
					frame.pulseColor = "var(--color-destructive)";
					frame.isTimeUp = true;
					toast.info("Cleared timer, game over!");

					// if we haven't confirmed our guess yet, default to making a guess
					if (!frame.hasGuessed) {
						if (JSON.stringify(frame.currentGuess) == "{}") {
							// no marker has been placed, emit no proper guess made info
							emitter.emit("Guess", {
								location: [0, 0],
								map: 0,
								round: frame.currentRound,
								time: -1,
								imageData: frame.location,
								distance: -1,
								score: 0
							});
						} else {
							// a marker has been placed, emit that as our guessed
							emitter.emit("Guess", {
								location: [frame.currentGuess.lat, frame.currentGuess.lng],
								map: frame.currentGuess.map,
								round: frame.currentRound,
								time: frame.countdownNumber,
								imageData: frame.location,
								// add scoring here
								distance: 0,
								score: 0
							} as guessInfoType);
						}
					}
				}
			}, 1000);

			emitter.on("Guess", () => {
				clearInterval(timer);
			});
			emitter.on("PlacedGuess", (data: Object) => {
				if (GameApp.state != "Guessing") return;
				this.currentGuess = data;
			});
		}
	});
</script>

<style scoped lang="less">
	.container {
		max-width: 100%;
	}
	.header {
		justify-content: center;
		font-size: 2rem;
		height: 80px;

		display: flex;
		flex-direction: row;
		gap: var(--space-md);
	}

	.round-number-container {
		color: var(--color-base--subtle);
		display: inline-block;
		font-size: 1rem;
		translate: 0 -1.2rem;
	}

	.button-container {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.subtitle {
		text-align: center;
	}

	button:disabled {
		cursor: not-allowed;
		background-color: var(--color-base);
		color: var(--color-surface-0);
	}
	#countdown {
		position: relative;
		height: 80px;
		width: 80px;
		text-align: center;
	}

	#countdown-number {
		color: var(--color);
		display: inline-block;
		translate: 0 0.5rem;
		animation: pulse 0.25s linear alternate infinite;
	}

	svg {
		position: absolute;
		top: 0;
		right: 0;
		width: 80px;
		height: 80px;
		transform: rotateY(-180deg) rotateZ(-90deg);
	}

	svg circle {
		stroke-dasharray: 228px;
		stroke-dashoffset: 0px;
		stroke-linecap: round;
		stroke-width: 4px;
		stroke: var(--color);
		fill: none;
		transition: stroke 0.5s ease-out;
		animation: countdown var(--countdown-length) linear forwards;
	}

	@keyframes countdown {
		from {
			stroke-dashoffset: 0px;
		}

		to {
			stroke-dashoffset: 228px;
		}
	}

	@keyframes pulse {
		from {
			color: var(--color-pulse);
		}

		to {
			color: var(--color);
		}
	}

	.game-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: calc(2 * var(--space-xl));
		margin: 0 2rem;

		@media screen and (max-width: 900px) {
			grid-template-columns: 1fr;
			margin: 0 0.5rem;
		}

		& h2 {
			text-align: center;
		}
	}

	.game-image {
		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
	}
</style>
