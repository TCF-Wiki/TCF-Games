<template>
	<section class="container">
		<Start v-if="state == 'Start'"></Start>
		<Game v-if="state == 'Guessing'" :currentRound="currentRound" :location="locations[currentRound]" :game-options="gameOptions"></Game>
		<ShowingGuesses v-if="state == 'ShowingGuesses'"></ShowingGuesses>
		<End v-if="state == 'End'"></End>
	</section>
</template>

<script lang="ts">
	//Import dependencies
	import "leaflet/dist/leaflet.css";
	import "leaflet";
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	//Location data
	import rawLocationData from "@/games/fortunaguessr/locationList.json";
	const locationData = rawLocationData as locationType[];
	//Import multiplayer
	import {GameIO, GameApp} from "@/games/fortunaguessr/multiplayer";
	import {IO, App} from "@/multiplayer";

	//Vue components
	import Start from "@/games/fortunaguessr/components/Start.vue";
	import Game from "@/games/fortunaguessr/components/Game.vue";
	import ShowingGuesses from "@/games/fortunaguessr/components/ShowingGuesses.vue";
	import End from "@/games/fortunaguessr/components/End.vue";

	//Data types
	export type locationType = {
		map: 1 | 2 | 3;
		src: string;
		x: number;
		y: number;
		difficulty: number[];
	};
	export type guessInfoType = {
		score: number;
		distance: number;
		time: number;
		location: number[];
		map: 1 | 2 | 3;
		round: number;
		imageData: locationType;
	};
	export type gameInfoType = {
		length: number;
		difficulty: number;
		timeLimit: number;
		maps: (1 | 2 | 3)[];
		seed: string;
	};

	//Create vue app
	export default defineComponent({
		name: "FortunaGuessrView",
		components: {
			Start,
			Game,
			ShowingGuesses,
			End
		},
		data: () => ({
			state: "Start" as "Start" | "Guessing" | "ShowingGuesses" | "End", //Current state
			currentRound: 0 as number, //Current round
			gameOptions: {} as gameInfoType, //Game options
			locations: [] as locationType[] //Game locations
		}),
		mounted() {
			GameIO.init();
			emitter.on("StartGameWithSeed", (seed: string) => {
				this.StartGameFromSeed(seed);
			});
			emitter.on(
				"StartGameWithOptions",
				(
					options: {
						length: number | null;
						difficulty: number | null;
						timeLimit: number | null;
						maps: (1 | 2 | 3)[] | null;
					} | null
				) => {
					this.StartGameFromOptions(options);
				}
			);
			emitter.on("Guess", (guessData: guessInfoType) => {
				console.log("Received guess event", guessData);
				GameApp.SubmitGuess(guessData);
				this.state = "ShowingGuesses";
			});
			emitter.on("StartNextRound", () => {
				if (App.host) {
					GameApp.StartNextRound();
				}
			});
			emitter.on("NextRound", () => {
				console.log("Recieved next round event");
				this.currentRound++;
				if (this.currentRound >= this.gameOptions.length) {
					this.state = "End";
				} else {
					this.state = "Guessing";
				}
			});
			emitter.on("BackToLobby", () => {
				console.log("Received back to lobby event");
				this.state = "Start";
			});
		},
		methods: {
			StartGameFromOptions(
				recievedOptions: {
					length: number | null;
					difficulty: number | null;
					timeLimit: number | null;
					maps: (1 | 2 | 3)[] | null;
				} | null
			) {
				console.log("Received start game event", recievedOptions);
				let options = {} as {
					length: number;
					difficulty: number;
					timeLimit: number;
					maps: (1 | 2 | 3)[];
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
				console.log("Game options", options);
				//Check if all options are set
				if (!options.length || !options.difficulty || !options.timeLimit || !options.maps) {
					toast.error("Game options has not been set");
					return;
				}
				//Generate game seed
				let seed = `${options.length}-${options.difficulty}-${options.timeLimit}-${options.maps.includes(1) ? "1" : "0"}${options.maps.includes(2) ? "1" : "0"}${options.maps.includes(3) ? "1" : "0"}`;

				//Generate game locations
				let availableLocations: locationType[] = locationData.filter((a) => a.difficulty.includes(options.difficulty) && options.maps.includes(a.map));
				console.log("Available locations", availableLocations);
				if (availableLocations.length < options.length) {
					toast.error("Not enough locations available with the selected options");
					console.log("Not enough locations available with the selected options");
					return;
				}
				for (let i = 0; i < options.length; i++) {
					//Get random location
					let location = availableLocations[Math.floor(Math.random() * availableLocations.length)];
					//Add location to game seed
					let dataIndex = locationData.indexOf(location);
					seed += `-${dataIndex}`;
					//Remove location from available locations
					availableLocations = availableLocations.filter((a) => a != location);
				}
				console.log("Game seed", seed);
				//Start game
				GameApp.StartGame(seed);
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
						let maps = [] as (1 | 2 | 3)[];
						if (splitSeed[3].charAt(0) == "1") maps.push(1);
						if (splitSeed[3].charAt(1) == "1") maps.push(2);
						if (splitSeed[3].charAt(2) == "1") maps.push(3);
						return maps;
					})(),
					seed: seed
				};
				//Set game locations
				this.locations = [];
				for (let i = 0; i < this.gameOptions.length; i++) {
					this.locations.push(locationData[parseInt(splitSeed[i + 4])]);
				}
				console.log("Game options", this.gameOptions);
				console.log("Game locations", this.locations);
				//Set state to guessing
				this.state = "Guessing";
				//Show toast
				toast.success("Game started");
			}
		}
	});
</script>
