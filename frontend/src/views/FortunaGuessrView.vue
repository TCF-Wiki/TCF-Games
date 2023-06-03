<template>
	<main class="container">
		<Start v-if="state == 'Start'" @startGame="StartGame"></Start>
		<Guessing v-if="state == 'Guessing'" @guess="Guess"></Guessing>
		<ShowingGuesses v-if="state == 'ShowingGuesses'" @nextRound="NextRound"></ShowingGuesses>
		<End v-if="state == 'End'" @backToLobby="BackToLobby" @restartGame="StartGame(null)"></End>
	</main>
</template>

<script lang="ts">
	//Import dependencies
	import "leaflet/dist/leaflet.css";
	import "leaflet";
	//Toast notifications
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;

	//Vue components
	import Start from "@/games/fortunaguessr/components/Start.vue";
	import Guessing from "@/games/fortunaguessr/components/Guessing.vue";
	import ShowingGuesses from "@/games/fortunaguessr/components/ShowingGuesses.vue";
	import End from "@/games/fortunaguessr/components/End.vue";

	//Create vue app
	export default {
		name: "FortunaGuessrView",
		data: () => ({
			state: "Start" as "Start" | "Guessing" | "ShowingGuesses" | "End", //Current state
			currentRound: 0 as number, //Current round
			gameOptions: {
				seed: "" as string, //Game seed
				rounds: 5 as number, //Total amount of rounds
				roundTime: 60 as number //Seconds
			}
		}),
		components: {
			Start,
			Guessing,
			ShowingGuesses,
			End
		},
		methods: {
			StartGame(
				options: {
					seed: string;
					rounds: number;
					roundTime: number;
				} | null
			) {
				console.log("Received start game event", options);
				if (options) {
					this.gameOptions = options;
				}
				this.state = "Guessing";
			},
			Guess(guessData: any) {
				console.log("Received guess event", guessData);
				this.state = "ShowingGuesses";
			},
			NextRound() {
				console.log("Recieved next round event");
				this.currentRound++;
				if (this.currentRound >= this.gameOptions.rounds) {
					this.state = "End";
				} else {
					this.state = "Guessing";
				}
			},
			BackToLobby() {
				console.log("Received back to lobby event");
				this.state = "Start";
			}
		},
		mounted() {}
	};
</script>
