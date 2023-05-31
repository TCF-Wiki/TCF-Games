<script lang="ts">
	import {defineComponent} from "vue";
	import {GameIO, GameApp} from "../multiplayer";
	//Import start function from main.ts
	import {startGame} from "../main";
	import {getGameInformation} from "../gameFunctionality";
	import {io} from "socket.io-client";

	GameIO.init();

	export default defineComponent({
		name: "DifficultyCard",
		data: function () {
			return {
				timeLength: 60,
				gameLength: 5,
				oneChecked: true,
				twoChecked: true,
				threeChecked: true
			};
		},
		props: ["difficulty", "description", "image", "mapIcon"],
		methods: {
			startGame(difficulty: string) {
				var maps: number[] = [];
				if (this.oneChecked) maps.push(1);
				if (this.twoChecked) maps.push(2);
				if (this.threeChecked) maps.push(3);
				if (difficulty == "Easy") maps = [1];
				startGame(null, difficulty, this.timeLength * 1000, this.gameLength, maps);
				GameIO.socket.emit("startGameWithSeed", getGameInformation().seed, GameApp.App.gameId);
				//console.log('tried to start game with seed ', getGameInformation().seed);
			},
			sliderRatio: function (e: any): void {
				let target = e.target;
				const min = target.min;
				const max = target.max;
				const val = target.value;
				target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
			}
		}
	});
</script>

<template>
	<section class="card">
		<div class="card-bg">
			<img :src="image" :alt="difficulty + ' represented by creature'" />
		</div>
		<div class="card-context">
			<div class="dark-bg"></div>
			<h2>{{ difficulty }}</h2>
			<p>
				{{ description }}
			</p>
			<button class="button" type="button" @click.prevent="startGame(difficulty)">Start Game</button>
		</div>
		<div class="card-icons">
			<ul>
				<li>
					<font-awesome-icon icon="fa-solid fa-stopwatch" />
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
					<font-awesome-icon icon="fa-solid fa-map" />
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
									<input :id="'map3checkbox' + difficulty" type="checkbox" value="3" checked @change="threeChecked = !threeChecked" :disabled="threeChecked && !twoChecked && !oneChecked ? true : false" />
									<label :for="'map3checkbox' + difficulty"> </label>
								</div>
							</div>
						</div>
					</div>
				</li>
				<li>
					<font-awesome-icon icon="fa-solid fa-hashtag" />
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
</template>

<style scoped>
	@import url("@/assets/base.css");
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
		height: 1.75em;
	}

	.checkbox-container span {
		width: 3em;
		padding: 0.4em;
		transform: translateY(-6px);
	}

	input[type="range"] {
		-webkit-appearance: none;
		height: 7px;
		background: var(--primary);
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
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: var(--tertairy);
		cursor: ew-resize;
		transition: background 0.3s ease-in-out;
	}

	input[type="range"]::-moz-range-thumb {
		-webkit-appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: var(--tertairy);
		cursor: ew-resize;
		transition: background 0.3s ease-in-out;
	}

	input[type="range"]::-ms-thumb {
		-webkit-appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: var(--tertairy);
		cursor: ew-resize;
		transition: background 0.3s ease-in-out;
	}

	input[type="range"]::-webkit-slider-thumb:hover {
		background: var(--tertairy-accent);
	}

	input[type="range"]::-moz-range-thumb:hover {
		background: var(--tertairy-accent);
	}

	input[type="range"]::-ms-thumb:hover {
		background: var(--tertairy-accent);
	}

	/* Input Track */
	input[type="range"]::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		box-shadow: none;
		border: none;
		background: transparent;
	}

	input[type="range"]::-moz-range-track {
		-webkit-appearance: none;
		box-shadow: none;
		border: none;
		background: transparent;
	}

	.card {
		position: relative;
		width: 24em;
		aspect-ratio: 1 / 1;
		clip-path: polygon(5% 0%, 100% 0, 100% 95%, 95% 100%, 0 100%, 0% 5%);

		overflow: hidden;
		-webkit-user-select: none;
		user-select: none;
		-webkit-box-shadow: 5px 5px 21px 4px rgba(4, 4, 4, 0.47);
		box-shadow: 5px 5px 21px 4px rgba(0, 0, 0, 0.47);
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
		left: 1em;
		color: var(--secondary);
		font-size: 2em;
		font-weight: 700;
		font-family: Nulshock, sans-serif;
	}

	.card .card-context p {
		position: relative;
		left: 2em;
		width: 82%;
		line-height: 1em;
		word-spacing: -2px;
		color: var(--secondary);
		text-align: justify;
		opacity: 0;
		transition: 0.2s ease-out;
		padding-bottom: 2em;
	}

	.card:hover .card-context p {
		opacity: 1;
	}

	.card .card-context .button {
		position: absolute;
		right: 0.6em;
		top: 28%;
		border: 0.2vh solid var(--tertairy-accent);
		font-weight: bold;
		padding: 0.1em;
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
		color: var(--secondary);
		background: var(--primary);
		font-size: 22px;
		margin: 0 0 10px;
		width: 2em;
		height: 2em;
		text-align: center;
		transition: 0.2s ease-out;
		overflow: hidden;
		clip-path: polygon(10% 0%, 100% 0, 100% 90%, 90% 100%, 0 100%, 0% 10%);
	}

	.card .card-icons li svg {
		margin-top: 0.4em;
	}

	.card .card-icons li:hover {
		background: var(--primary-accent);
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
</style>
