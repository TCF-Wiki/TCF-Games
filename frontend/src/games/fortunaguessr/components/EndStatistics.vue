<template>
	<ul>
		<li>
			<h2>Breakdown</h2>
			<div>
				<p><font-awesome-icon icon="fa-solid fa-star" /> Score</p>
				<p><font-awesome-icon icon="fa-solid fa-ruler" /> Distance</p>
				<p><font-awesome-icon icon="fa-solid fa-clock" /> Time</p>
				<p><font-awesome-icon icon="fa-solid fa-map" /> Map</p>
			</div>
		</li>
		<li v-for="(guess, index) in guessData">
			<h2>Round {{ index + 1 }}</h2>
			<div>
				<p>{{ guess.score }} pts</p>
				<p>{{ distanceHelper(guess.distance).includes("-") ? "Wrong Map" : distanceHelper(guess.distance) }}</p>
				<p>{{ (guess.time / 1000).toFixed(1) }}s</p>
				<p>{{ guess.map == 1 ? "BS" : guess.map == 2 ? "CF" : "BS" }}</p>
			</div>
		</li>
		<li>
			<h2>Total</h2>
			<div>
				<p><span id="score"></span> pts out of <span id="length"></span></p>
				<p><span id="distance"></span></p>
				<p><span id="time"> </span></p>
			</div>
		</li>
	</ul>
</template>

<style scoped>
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
	}

	ul li {
		padding: 1em;
	}
</style>

<script lang="ts">
	import {getGuessInformation, getGameInformation} from "../gameFunctionality";
	import {distanceDisplayer} from "../main";
	import {defineComponent} from "vue";
	export default defineComponent({
		name: "EndStatistics",
		data: function () {
			return {
				guessData: getGuessInformation()
			};
		},
		methods: {
			distanceHelper(distance: number) {
				return distanceDisplayer(distance);
			}
		},
		mounted() {
			var guessInfo = getGuessInformation();
			var gameInfo = getGameInformation();

			var distance = 0;
			var time = 0;

			guessInfo.forEach((guess) => {
				if (guess.distance >= 0) distance += guess.distance;
				else distance += 5000;
				time += guess.time;
			});

			var data = {
				difficulty: gameInfo.difficulty,
				score: gameInfo.score,
				gameLength: gameInfo.length,
				meters: Math.round(distance),
				time: Math.round(time / 100) / 10,
				limit: gameInfo.timeLimit / 1000
			};
			var element = document.getElementById("difficulty");
			if (element) {
				element.innerHTML = data.difficulty == 1 ? "Easy" : data.difficulty == 2 ? "Medium" : data.difficulty == 3 ? "Hard" : "Insane";
				element = null;
			}
			element = document.getElementById("score");
			if (element) {
				element.innerHTML = data.score.toString();
				element = null;
			}
			element = document.getElementById("length");
			if (element) {
				element.innerHTML = (data.gameLength * 5000).toString();
				element = null;
			}
			element = document.getElementById("distance");
			if (element) {
				let preferredUnit = localStorage.getItem("preferredUnit");
				if (preferredUnit == "imperial" || !preferredUnit) {
					element.innerHTML = Math.round(data.meters * 3.28084).toString() + "ft";
				} else if (preferredUnit == "metric" || !preferredUnit) {
					element.innerHTML = Math.round(data.meters).toString() + "m";
				}
				element = null;
			}
			element = document.getElementById("timeLimit");
			if (element) {
				element.innerHTML = data.limit.toString();
				element = null;
			}
			element = document.getElementById("time");
			if (element) {
				element.innerHTML = data.time.toString() + "s";
				element = null;
			}
		}
	});
</script>
