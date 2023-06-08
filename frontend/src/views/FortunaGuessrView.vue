<template>
	<section class="upper-container">
		<div id="component"></div>
	</section>
</template>
<style scoped lang="less">
.upper-container {
	max-width: calc(99vw - 2.8 * var(--padding-page));

	@media screen and (max-width: 900px) {
		max-width: 100vw;
		margin: var(--space-xs);
	}
}
</style>
<script lang="ts">
//Import dependencies
import "leaflet/dist/leaflet.css";
import "leaflet";
import {defineComponent, createApp} from "vue";
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
	data: () => ({
		state: "Start" as "Start" | "Guessing" | "ShowingGuesses" | "End", //Current state
		currentRound: 0 as number, //Current round
		gameOptions: {} as gameInfoType, //Game options
		locations: [] as locationType[], //Game locations
		currentComponent: createApp(Start) as any, //Currently mounted vue component
		canStartGame: true
	}),
	mounted() {
		GameApp.state = "Start";
		this.currentComponent.mount("#component");
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
				if (this.canStartGame) {
					this.canStartGame = false;
					setTimeout(() => {
						this.canStartGame = true;
					}, 250);
					this.StartGameFromOptions(options);
				}
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
				if (App.host) GameApp.SendGameEnded();
			} else {
				this.state = "Guessing";
			}
		});
		emitter.on("GameEnded", () => {
			console.log("Received game ended event");
			this.state = "End";
		});
		emitter.on("BackToLobby", () => {
			console.log("Received back to lobby event");
			this.state = "Start";
		});
		emitter.on("RoomJoined", () => {
			console.log("Received room joined event");
			this.state = "Start";
		});
		this.state = "Start";
	},
	watch: {
		state() {
			console.log("State changed to", this.state);
			let VueFile = (() => {
				switch (this.state) {
					case "Start":
						return Start;
					case "Guessing":
						return Game;
					case "ShowingGuesses":
						return ShowingGuesses;
					case "End":
						return End;
				}
			})();
			GameApp.state = this.state;
			let VueApp = createApp(VueFile, {
				location: this.locations[this.currentRound],
				currentRound: this.currentRound,
				gameOptions: this.gameOptions
			});

			//Unmount old component
			if (this.currentComponent) {
				this.currentComponent.unmount();
			}
			//Mount new component
			VueApp.mount("#component");
			this.currentComponent = VueApp;
		}
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
			try {
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
			} catch {
				toast.error("Invalid seed (" + seed + ")");
			}
		}
	}
});
</script>
