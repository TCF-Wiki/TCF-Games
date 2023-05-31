<template>
	<main>
		<EndStatistics />
		<MultiplayerEnd v-if="showMultiplayer" />
		<EndMap />
		<button class="button endScreenButton" @click.prevent="restartGame">Play Again</button>
		<button class="button endScreenButton" @click.prevent="goBackToMenu">Select difficulty</button>
		<!-- <EndShare /> -->
	</main>
</template>
<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
	}
	.endScreenButton {
		padding: 1em 2em;
		margin-bottom: 1em;
	}
</style>
<script lang="ts">
	import {createApp, defineComponent} from "vue";
	import {startGame, showDifficultySelector, hideEverything} from "../main";
	import EndStatistics from "./EndStatistics.vue";
	import EndMap from "./EndMap.vue";
	import MultiplayerEnd from "./MultiplayerEnd.vue";
	import EndShare from "./EndShare.vue";
	import {GameIO, GameApp} from "../multiplayer";

	import {library} from "@fortawesome/fontawesome-svg-core";
	import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
	import {faStopwatch, faMap, faLocationPin, faClock, faRuler, faStar, faHourglass} from "@fortawesome/free-solid-svg-icons";
	library.add(faStopwatch, faMap, faLocationPin, faClock, faRuler, faStar, faHourglass);

	export default defineComponent({
		name: "End",
		components: {EndStatistics, EndShare, MultiplayerEnd, EndMap, FontAwesomeIcon},
		mounted() {
			//Multiplayer?
			if (GameApp.App.gameId !== "0") {
				this.showMultiplayer = true;
			}
		},
		data() {
			return {
				showMultiplayer: false
			};
		},
		methods: {
			restartGame: function () {
				hideEverything(true);
				startGame(null, null, null, null, null);
			},
			goBackToMenu: function () {
				hideEverything(true);
				showDifficultySelector();
			}
		}
	});
</script>
