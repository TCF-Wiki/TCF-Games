<template>
	<section>
		<h2>Seed</h2>
		<p>Current Seed:</p>
		<p id="seedValue">-</p>
	</section>
</template>

<script lang="ts">
	import {getGameInformation} from "../gameFunctionality";
	export default {
		name: "FooterSeed",
		mounted() {
			var seedValue = document.getElementById("seedValue");
			if (seedValue && seedValue) {
				seedValue.innerHTML = getGameInformation().seed != "" ? getGameInformation().seed : "-";
			}
		}
	};
	export function updateInfo(): void {
		var gameData = getGameInformation();
		var element = document.getElementById("seedValue");
		if (element) element.innerText = gameData.seed;
	}
</script>

<style scoped>
	* {
		font-family: "Oxonium", sans-serif;
	}

	h2 {
		padding-bottom: 0.5em;
		font-size: clamp(1.25em, 2.5vw, 1.5em);
		font-family: "Nulshock", sans-serif;
	}
</style>
