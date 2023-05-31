<template>
	<button class="button" id="guessBtn">Make Guess</button>
	<button class="button" @click.prevent="nextClick()" id="nextBtn">Next image</button>
</template>

<style scoped>
	#nextBtn {
		visibility: hidden;
		position: absolute;
	}

	.button {
		padding: 1em 2em;
	}
</style>
<script lang="ts">
	import {hideGuess, startGame, getGuessing} from "../main";
	import {resetGuessMap} from "./GuessMap.vue";
	import {GameIO, GameApp} from "../multiplayer";
	import {getImgNumber} from "../gameFunctionality";
	import {isReady} from "./MultiplayerGuess.vue";
	import {defineComponent} from "vue";
	export default defineComponent({
		mounted() {
			//Next button click event
			document.addEventListener("keydown", (e) => {
				if (e.code === "KeyN" && !getGuessing()) {
					this.nextClick();
				}
			});
		},
		methods: {
			nextClick() {
				if (GameApp.App.gameId != "0") {
					//Multiplayer
					if (GameApp.App.myRole == "Host") {
						GameIO.socket.emit("nextImage", {id: GameApp.App.gameId, round: getImgNumber()});
						//console.log('Next Image event sent: ' + getImgNumber());
						resetGuessMap();
						hideGuess();
					}
				} else {
					//Singleplayer
					resetGuessMap();
					hideGuess();
				}
			}
		}
	});
</script>
