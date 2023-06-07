<script lang="ts">
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	export default {
		name: "DifficultyCard",
		data: function () {
			return {
				timeLength: 60,
				gameLength: 5,
				oneChecked: true,
				twoChecked: true,
				threeChecked: this.difficulty == "Hard" || this.difficulty == "Insane" ? true : false
			};
		},
		props: ["difficulty", "description", "image", "mapIcon"],
		methods: {
			startGame() {
				var maps: number[] = [];
				if (this.oneChecked) maps.push(1);
				if (this.twoChecked) maps.push(2);
				if (this.threeChecked) maps.push(3);
				if (this.difficulty == "Easy") maps = [1];

				let options = {
					length: this.gameLength,
					difficulty: this.difficulty == "Easy" ? 1 : this.difficulty == "Medium" ? 2 : this.difficulty == "Hard" ? 3 : this.difficulty == "Insane" ? 4 : -1,
					timeLimit: this.timeLength,
					maps: maps
				} as gameInfoType;
				console.log("Starting game with options: ", options);
				emitter.emit("StartGameWithOptions", options);
			},
			sliderRatio: function (e: any): void {
				let target = e.target;
				const min = target.min;
				const max = target.max;
				const val = target.value;
				target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
			}
		}
	};
</script>

<template>
	<Transition name="scale-in" appear>
		<section class="card">
			<div class="card-bg">
				<img :src="'/' + image" :alt="difficulty + ' represented by creature'" />
			</div>
			<div class="card-context">
				<div class="dark-bg"></div>
				<h2>{{ difficulty }}</h2>
				<p>
					{{ description }}
				</p>
				<button type="button" @click.prevent="startGame()">Start Game</button>
			</div>
			<div class="card-icons">
				<ul>
					<li>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
							<!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
							<path
								d="M176 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h16V98.4C92.3 113.8 16 200 16 304c0 114.9 93.1 208 208 208s208-93.1 208-208c0-41.8-12.3-80.7-33.5-113.2l24.1-24.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L355.7 143c-28.1-23-62.2-38.8-99.7-44.6V64h16c17.7 0 32-14.3 32-32s-14.3-32-32-32H224 176zm72 192V320c0 13.3-10.7 24-24 24s-24-10.7-24-24V192c0-13.3 10.7-24 24-24s24 10.7 24 24z"
							/>
						</svg>
						<div class="icon-context">
							<div class="container">
								<h3>Time Limit</h3>
								<input id="timeSlider" type="range" min="5" max="120" v-model="timeLength" step="5" @input="sliderRatio" />
								<br />
								<label for="timeSlider"> {{ timeLength }}s </label>
							</div>
						</div>
					</li>
					<li v-if="!mapIcon">
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
							<!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
							<path d="M384 476.1L192 421.2V35.9L384 90.8V476.1zm32-1.2V88.4L543.1 37.5c15.8-6.3 32.9 5.3 32.9 22.3V394.6c0 9.8-6 18.6-15.1 22.3L416 474.8zM15.1 95.1L160 37.2V423.6L32.9 474.5C17.1 480.8 0 469.2 0 452.2V117.4c0-9.8 6-18.6 15.1-22.3z" />
						</svg>
						<div class="icon-context">
							<div class="container">
								<h3>Maps</h3>
								<div class="checkbox-container">
									<span> BS </span>
									<div class="toggle-pill-color">
										<input :id="'map1checkbox' + difficulty" type="checkbox" value="1" checked @change="oneChecked = !oneChecked" :disabled="!threeChecked && !twoChecked && oneChecked ? true : false" />
										<label :for="'map1checkbox' + difficulty"> </label>
									</div>
								</div>
								<div class="checkbox-container">
									<span> CF </span>
									<div class="toggle-pill-color">
										<input :id="'map2checkbox' + difficulty" type="checkbox" value="2" checked @change="twoChecked = !twoChecked" :disabled="!threeChecked && twoChecked && !oneChecked ? true : false" />
										<label :for="'map2checkbox' + difficulty"> </label>
									</div>
								</div>
								<div class="checkbox-container">
									<span> TI </span>
									<div class="toggle-pill-color">
										<input :id="'map3checkbox' + difficulty" type="checkbox" value="3" :checked="difficulty == 'Hard' || difficulty == 'Insane' ? true : false" @change="threeChecked = !threeChecked" :disabled="threeChecked && !twoChecked && !oneChecked ? true : false" />
										<label :for="'map3checkbox' + difficulty"> </label>
									</div>
								</div>
							</div>
						</div>
					</li>
					<li>
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
							<!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
							<path
								d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H347.1L325.8 320H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H315.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7H155.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320h95.1l21.3-128H187.1z"
							/>
						</svg>
						<div class="icon-context">
							<div class="container">
								<h3>Rounds</h3>
								<input id="gameLengthSlider" type="range" min="1" max="20" v-model="gameLength" @input="sliderRatio" />
								<br />
								<label for="gameLengthSlider"> {{ gameLength }} round{{ gameLength > 1 ? "s" : "" }} </label>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</section>
	</Transition>
</template>

<style scoped lang="less">
	* {
		margin: 0;
		padding: 0;
		border: 0;
		list-style: none;
		box-sizing: border-box;
	}

	.checkbox-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: space-between;
		height: 1.75rem;
	}

	.checkbox-container span {
		width: 3rem;
		padding: 0.4rem;
		transform: translateY(-6px);
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		height: 7px;
		background: var(--color-base);
		border-radius: 5px;
		background-size: 50% 100%;
		background-repeat: no-repeat;
	}

	#gameLengthSlider {
		background-size: 20% 100%;
	}

	/* Input Thumb */
	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 50%;
		background: var(--rarity-color-rare);
		cursor: ew-resize;
		transition: background 0.3s ease-in-out;
	}

	input[type="range"]::-moz-range-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 50%;
		background: var(--rarity-color-rare);
		cursor: ew-resize;
		transition: background 0.3s ease-in-out;
	}

	input[type="range"]::-ms-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 50%;
		background: var(--rarity-color-rare);
		cursor: ew-resize;
		transition: filter 0.3s ease-in-out;
	}

	input[type="range"]::-webkit-slider-thumb:hover {
		filter: brightness(110%);
	}

	input[type="range"]::-moz-range-thumb:hover {
		filter: brightness(110%);
	}

	input[type="range"]::-ms-thumb:hover {
		filter: brightness(110%);
	}

	/* Input Track */
	input[type="range"]::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		appearance: none;
		box-shadow: none;
		border: none;
		background: transparent;
	}

	input[type="range"]::-moz-range-track {
		-webkit-appearance: none;
		appearance: none;
		box-shadow: none;
		border: none;
		background: transparent;
	}

	.card {
		position: relative;
		width: 100%;
		max-width: 80vw;
		aspect-ratio: 1 / 1;

		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

		overflow: hidden;
		-webkit-user-select: none;
		user-select: none;
	}

	.card .card-bg {
		width: 100%;
		height: 100%;
	}

	.card .card-bg img {
		width: 100%;
		height: 100%;
		transition: 0.2s ease-out;
	}

	.card:hover .card-bg img {
		transform: scale(1.05);
	}

	.card .card-context {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100%;
		transform: translateY(80%);
		transition: 0.2s ease-out;
	}

	.card:hover .card-context {
		transform: translateY(60%);
	}

	.card .card-context .dark-bg {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.2);
		background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9));
		filter: blur(20px);
		transition: 0.2s ease-out;
	}

	.card .card-context h2 {
		position: relative;
		padding-left: 1rem;
		text-align: left;
		color: var(--color-base--emphasized);
		font-size: 2rem;
		font-weight: 700;

		@media screen and (max-width: 900px) {
			font-size: 1.5rem;
		}
	}

	.card .card-context p {
		position: relative;
		left: 2em;
		width: 82%;
		line-height: 1em;
		word-spacing: -2px;
		color: var(--color-base);
		text-align: justify;
		opacity: 0;
		transition: 0.2s ease-out;
		padding-bottom: 2em;

		@media screen and (max-width: 900px) {
			font-size: 0.7rem;
		}
	}

	.card:hover .card-context p {
		opacity: 1;
	}

	.card .card-context button {
		position: absolute;
		background-color: var(--color-base--subtle);
		right: 0.6rem;
		top: 25%;
		color: var(--color-surface-0);
		padding: var(--space-xs) var(--space-sm);
		font-weight: bold;

		border-radius: 2rem;

		&:hover {
			filter: brightness(110%);
		}
	}

	.card .card-icons {
		position: absolute;
		top: 2em;
		left: 2em;
		opacity: 0;
		transform: translateX(2.3em) scale(0.5);
		transform-origin: top;
		transition: 0.2s ease-out;
	}

	.card:hover .card-icons {
		opacity: 1;
		transform: translateX(0);
	}

	.card .card-icons li {
		cursor: pointer;
		background: var(--color-surface-1);
		font-size: 22px;
		margin: 0 0 10px;
		width: 2em;
		height: 2em;
		text-align: center;
		transition: 0.2s ease-out;
		overflow: hidden;
		border-radius: 0.8rem;

		@media screen and (max-width: 900px) {
			width: 2rem;
			height: 2rem;
			font-size: 18px;
		}
	}

	.card .card-icons li svg {
		margin-top: 0.4em;
	}

	.card .card-icons li:hover {
		background: var(--color-surface-2);
		transform: translateX(-5px);
		width: 8em;
		height: 8em;
	}

	.card .card-icons li:hover:not(:hover) {
		transform: translateX(200%);
	}

	.card .card-icons li .icon-context {
		opacity: 0;
		font-size: smaller;
	}

	.card .card-icons li:hover .icon-context {
		opacity: 1;
	}

	.card .card-icons li:hover .icon-context input {
		width: 80%;
	}

	.card .card-icons li .icon-context input[type="checkbox"] {
		transform: scale(0);
	}

	.card .card-icons li:hover .icon-context input[type="checkbox"] {
		transform: scale(1);
	}

	svg {
		fill: var(--color-base--emphasized);
	}
</style>
