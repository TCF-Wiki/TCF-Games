//Import dependencies
import "leaflet/dist/leaflet.css";
import {createApp} from "vue";
import Leaflet from "leaflet";
import {GameApp, GameIO} from "./multiplayer";
//Import vue apps
import Image from "./components/GameImage.vue";
import Map from "./components/GameMap.vue";
import GameGuess from "./components/GuessMain.vue";
import GuessMap from "./components/GuessMap.vue";
import End from "./components/EndScreen.vue";
import Buttons from "./components/GameButtons.vue";
import Info from "./components/GameInfo.vue";
import DifficultySelector from "./components/DifficultySelector.vue";
import Footer from "./components/FooterMain.vue";

import {app} from "@/main";
const toast = app.config.globalProperties.$toast;

//Setup vue apps
var imageApp = createApp(Image);
var mapApp = createApp(Map);
var buttonApp = createApp(Buttons);
var infoApp = createApp(Info);
var difficultyApp = createApp(DifficultySelector);

var footer = createApp(Footer);
footer.mount("#footer");

// Setup leaflet markers
var correctIcon = Leaflet.icon({
	iconUrl: "/flag-solid.svg",
	iconSize: [26, 37],
	iconAnchor: [13, 37],
	popupAnchor: [1, -34]
});
var guessIcon = Leaflet.icon({
	iconUrl: "marker-icon-guess.png",
	iconSize: [26, 37],
	iconAnchor: [13, 37],
	popupAnchor: [1, -34]
});

//Import functions
import {nextImage, getImageData, load} from "./gameFunctionality";
import type {guessInfo, location, gameInfo} from "./gameFunctionality";
import {getMapObj, getMarker, switchMap, removeMarker, resetMap} from "./mapFunctionality";

//Hide loader
var loaderElem = document.querySelector(".loader") as HTMLElement;
if (loaderElem) loaderElem.style.position = "absolute";
//Setup element references
var leftSide = document.getElementById("left") as HTMLDivElement;
var rightSide = document.getElementById("right") as HTMLDivElement;
var all = document.getElementById("all") as HTMLDivElement;
var buttons = document.getElementById("buttons") as HTMLDivElement;

//Hide everything
export function hideEverything(unmount: boolean = false) {
	//Unmount apps
	if (unmount) {
		imageApp.unmount();
		mapApp.unmount();
		buttonApp.unmount();
		infoApp.unmount();
		difficultyApp.unmount();
	}

	//Hide side elements + buttons
	if (leftSide && rightSide && buttons && all) {
		leftSide.style.visibility = "hidden";
		leftSide.style.position = "absolute";
		rightSide.style.visibility = "hidden";
		rightSide.style.position = "absolute";
		all.style.visibility = "hidden";
		all.style.position = "absolute";
		buttons.style.visibility = "hidden";
		buttons.style.position = "absolute";
	}
}

//Show difficulty selector
showDifficultySelector();
export function showDifficultySelector() {
	hideEverything();
	//Show all element
	if (all) {
		all.style.visibility = "visible";
		all.style.position = "relative";
	}
	//Mount Difficulty Selector
	difficultyApp = createApp(DifficultySelector);
	difficultyApp.mount("#all");
}

//Setup game variables
var guessing: boolean = true;
var difficulty: number;
var time: number = 0;
var gameLength: number = 0;
var availableMaps: number[] = [];
var indexes: number[] = [];

//Start game function
export function startGame(seed: string | null, newDifficulty: string | null, newTime: number | null, newGameLength: number | null, newMaps: number[] | null) {
	difficultyApp.unmount();
	hideEverything();
	//Mount game info
	infoApp = createApp(Info);
	infoApp.mount("#info");
	//Save information
	if (seed) {
		//console.log(seed);
		var temp = seed.split("-");
		difficulty = parseInt(temp[0]);
		time = parseInt(temp[1]);
		temp[2].charAt(0) == "1" ? availableMaps.push(1) : null;
		temp[2].charAt(1) == "1" ? availableMaps.push(2) : null;
		temp[2].charAt(2) == "1" ? availableMaps.push(3) : null;
		gameLength = parseInt(temp[3]);
		indexes = temp[4].split(".").map((x) => parseInt(x));
	} else {
		if (newDifficulty) difficulty = newDifficulty == "Easy" ? 1 : newDifficulty == "Medium" ? 2 : newDifficulty == "Hard" ? 3 : newDifficulty == "Insane" ? 4 : newDifficulty == "All" ? 5 : 0;
		if (newTime) time = newTime;
		if (newGameLength) gameLength = newGameLength;
		if (newMaps) availableMaps = newMaps;
		indexes = [];
	}
	var diffElement = document.getElementById("difficulty") as HTMLSpanElement;
	if (diffElement) diffElement.innerText = difficulty == 1 ? "Easy" : difficulty == 2 ? "Medium" : difficulty == 3 ? "Hard" : difficulty == 4 ? "Insane" : difficulty == 5 ? "All" : "Error";

	//Show elements needed
	leftSide.style.visibility = "visible";
	leftSide.style.position = "relative";
	rightSide.style.visibility = "visible";
	rightSide.style.position = "relative";
	buttons.style.visibility = "visible";
	buttons.style.position = "relative";
	//Mount image and map
	imageApp = createApp(Image);
	mapApp = createApp(Map);
	imageApp.mount("#left");
	mapApp.mount("#right");
	//Mount the buttons
	buttonApp = createApp(Buttons);
	buttonApp.mount("#buttons");

	//Run load function
	var started = load(seed);
	//If loading failed, show difficulty selector
	if (!started) {
		hideEverything(true);
		showDifficultySelector();
		return;
	}
	toast.success("Game started");

	if (GameApp.App.gameId != "0") GameIO.socket.emit("roomState", {gameId: GameApp.App.gameId, state: "playing"});
	GameApp.Player.updatePlayerData("guessing", null);
	//Set guessing to true
	guessing = true;
}

//Show the guess popup
var guessApp = createApp(GameGuess);
var guessMapApp = createApp(GuessMap);
export function showGuess(info: guessInfo) {
	guessing = false;
	//Unmount old
	resetMap();
	mapApp.unmount();
	imageApp.unmount();
	//Mount guess popup
	guessApp = createApp(GameGuess);
	guessApp.mount("#left");
	guessMapApp = createApp(GuessMap);
	guessMapApp.mount("#right");
	//Set guess information
	var pointElement = document.getElementById("points") as HTMLSpanElement;
	var distanceElement = document.getElementById("distance") as HTMLSpanElement;
	if (info.distance == -1) distanceElement.innerHTML = "Wrong map";
	else {
		distanceElement.innerHTML = distanceDisplayer(info.distance);
	}
	pointElement.innerHTML = info.score.toString();
	//Change button
	var guessButton = document.getElementById("guessBtn");
	if (guessButton) {
		guessButton.style.visibility = "hidden";
		guessButton.style.position = "absolute";
	}
	var nextButton = document.getElementById("nextBtn");
	if (nextButton && GameApp.App.gameId == "0") {
		nextButton.style.visibility = "visible";
		nextButton.style.position = "relative";
	}
}
//Hide the guess popup again
export function hideGuess() {
	//console.log('Hiding guess');
	guessing = true;
	guessApp.unmount();
	guessMapApp.unmount();
	imageApp = createApp(Image);
	imageApp.mount("#left");
	mapApp = createApp(Map);
	mapApp.mount("#right");
	var nextButton = document.getElementById("nextBtn");
	if (nextButton) {
		nextButton.style.visibility = "hidden";
		nextButton.style.position = "absolute";
	}
	var guessButton = document.getElementById("guessBtn");
	if (guessButton) {
		guessButton.style.visibility = "visible";
		guessButton.style.position = "relative";
	}
	GameApp.Player.updatePlayerData("guessing", null);
	nextImage();
}

//Show end screen
var endApp = createApp(End);
export function showEnd() {
	guessing = false;
	hideEverything(true);
	//Show all element
	all.style.visibility = "visible";
	all.style.position = "relative";
	//mount end screen
	endApp = createApp(End);
	endApp.mount("#all");
}

//Export values...
export function getGuessing(): boolean {
	return guessing;
}
export function getDifficulty(): number {
	return difficulty;
}
export function getTime(): number {
	return time;
}
export function getGameLength(): number {
	return gameLength;
}
export function getAvailableMaps(): number[] {
	return availableMaps;
}
export function getIndexes(): number[] {
	return indexes;
}

export function distanceDisplayer(distance: number): string {
	let preferredUnit = localStorage.getItem("preferredUnit");
	if (preferredUnit == "imperial" || !preferredUnit) {
		return Math.round(distance * 3.28084).toString() + "ft";
	} else if (preferredUnit == "metric" || !preferredUnit) {
		return Math.round(distance).toString() + "m";
	}
	return Math.round(distance).toString() + "m";
}

export function deleteAllUrlParameter(): void {
	window.history.pushState({}, document.title, "/");
}
