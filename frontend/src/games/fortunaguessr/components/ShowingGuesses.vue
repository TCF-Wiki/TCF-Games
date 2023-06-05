<template>
	<section class="container">
		<h1>Showing Guesses</h1>
		<!--This is a temporary test button-->
		<button v-if="showControls" @click="nextRound()">Next Round</button>
		<ShowingGuessesMap :gameOptions="gameOptions" />
	</section>
</template>
<script lang="ts">
	import {defineComponent, type PropType} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import ShowingGuessesMap from "./ShowingGuesses/ShowingGuessesMap.vue";
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
			emitter.on("Guess", (guessData: guessInfoType) => {
				this.guessData = guessData;
			});
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				this.playerList = players;
				this.checkControl();
			});
			emitter.on("HostChanged", () => {
				this.checkControl();
			});
		},
		components: {ShowingGuessesMap}
	});
</script>
<style scoped></style>
