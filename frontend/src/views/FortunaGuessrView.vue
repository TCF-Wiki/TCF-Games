<template>
	<main class="container">
		<Game v-if="state == 'Guessing'" :location="locations[currentRound]" :game-options="gameOptions" @guess="Guess">
		</Game>
		<Start v-if="state == 'Start'" @startGame="StartGameFromOptions" @startFromSeed="StartGameFromSeed"></Start>
		<ShowingGuesses v-if="state == 'ShowingGuesses'" @nextRound="NextRound"></ShowingGuesses>
		<End v-if="state == 'End'" @backToLobby="BackToLobby" @restartGame="StartGameFromOptions"></End>
	</main>
</template>

<script lang="ts">
//Import dependencies
import "leaflet/dist/leaflet.css";
import "leaflet";
import { defineComponent } from "vue";
//Toast notifications
import { app } from "@/main";
const toast = app.config.globalProperties.$toast;
//Location data
import locationData from "@/games/fortunaguessr/locationList.json";

//Vue components
import Start from "@/games/fortunaguessr/components/Start.vue";
import Game from "@/games/fortunaguessr/components/Game.vue";
import ShowingGuesses from "@/games/fortunaguessr/components/ShowingGuesses.vue";
import End from "@/games/fortunaguessr/components/End.vue";

//Data types
export type locationType = { map: number; src: string; x: number; y: number; difficulty: number[] };
export type guessInfoType = { score: number; distance: number; time: number; location: number[]; map: number; imageData: locationType };
export type gameInfoType = { length: number; difficulty: number; timeLimit: number; maps: number[]; seed: string };

//Create vue app
export default defineComponent({
	name: "FortunaGuessrView",
	components: {
    Start,
    Game,
    ShowingGuesses,
    End,
},
	data: () => ({
		state: "Start" as "Start" | "Guessing" | "ShowingGuesses" | "End", //Current state
		currentRound: 0 as number, //Current round
		gameOptions: {} as gameInfoType, //Game options
		locations: [] as locationType[] //Game locations
	}),
	methods: {
		StartGameFromOptions(recievedOptions: { length: number | null; difficulty: number | null; timeLimit: number | null; maps: number[] | null } | null) {
			console.log("Received start game event", recievedOptions);
			let options = {} as {
				length: number;
				difficulty: number;
				timeLimit: number;
				maps: number[];
			};
			//Retrieve game options
			if (recievedOptions) {
				options.length = recievedOptions.length || this.gameOptions.length;
				options.difficulty = recievedOptions.difficulty || this.gameOptions.difficulty;
				options.timeLimit = recievedOptions.timeLimit || this.gameOptions.timeLimit;
				options.maps = recievedOptions.maps || this.gameOptions.maps;
			} else {
				options = this.gameOptions;
			}
			//Check if all options are set
			if (!options.length || !options.difficulty || !options.timeLimit || !options.maps) {
				toast.error("Game options has not been set");
				return;
			}
			//Generate game seed
			let seed = `${options.length}-${options.difficulty}-${options.timeLimit}-${options.maps.includes(1) ? "1" : "0"}${options.maps.includes(2) ? "1" : "0"}${options.maps.includes(3) ? "1" : "0"}`;

			//Generate game locations
			let availableLocations: locationType[] = locationData.filter((a) => a.difficulty.includes(options.difficulty) && options.maps.includes(a.map));
			for (let i = 0; i < length; i++) {
				//Get random location
				let index = Math.floor(Math.random() * availableLocations.length);
				//Add location to game seed
				seed += `-${locationData.indexOf(availableLocations[index])}`;
				//Remove location from available locations
				availableLocations.filter((a) => a != availableLocations[index]);
			}
			console.log("Game seed", seed);
			//Start game
			this.StartGameFromSeed(seed);
		},
		StartGameFromSeed(seed: string) {
			console.log("Starting game from seed", seed);
			//Set current round to 0
			this.currentRound = 0;
			//Set game options
			let splitSeed = seed.split("-");
			this.gameOptions = {
				length: parseInt(splitSeed[0]),
				difficulty: parseInt(splitSeed[1]),
				timeLimit: parseInt(splitSeed[2]),
				maps: (() => {
					let maps = [];
					if (splitSeed[3] == "1") maps.push(1);
					if (splitSeed[4] == "1") maps.push(2);
					if (splitSeed[5] == "1") maps.push(3);
					return maps;
				})(),
				seed: seed
			};
			//Set game locations
			this.locations = [];
			for (let i = 0; i < this.gameOptions.length; i++) {
				this.locations.push(locationData[parseInt(splitSeed[i + 6])]);
			}
			//Set state to guessing
			this.state = "Guessing";
		},
		Guess(guessData: guessInfoType) {
			console.log("Received guess event", guessData);
			this.state = "ShowingGuesses";
		},
		NextRound() {
			console.log("Recieved next round event");
			this.currentRound++;
			if (this.currentRound >= this.gameOptions.length) {
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
	mounted() {
		console.log("Mounted FortunaGuessrView");
		toast.success("FortunaGuessr loaded");
	}
});
</script>
