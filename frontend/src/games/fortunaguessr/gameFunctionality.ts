//Setup image location data
export type location = {map: number; src: string; x: number; y: number; difficulty: number[]};
export type guessInfo = {score: number; distance: number; time: number; location: number[]; map: number; imageData: location};
export type gameInfo = {score: number; length: number; difficulty: number; timeLimit: number; seed: string};
import locationData from "./locationList.json";
import {app} from "@/main";
const toast = app.config.globalProperties.$toast;

//Setup variables
var info: gameInfo = {
	score: 0,
	length: 5,
	difficulty: 0,
	timeLimit: 60 * 1000,
	seed: ""
};
var imageData: location[];
var guessInformation: guessInfo[] = [];
var currentTime = 0;

var imageData: location[];
var currentImg: number = 0;
//Import markers.ts functions
import {getMap, getMapObj, getMarker, getZoom, removeMarker} from "./mapFunctionality";
//Import main functions
import {showGuess, showEnd, getDifficulty, getTime, getGameLength, getAvailableMaps, getGuessing, getIndexes} from "./main";
import {updateInfo} from "./components/FooterSeed.vue";

export function load(seed: string | null) {
	//Reset variables
	currentImg = 0;
	info.score = 0;
	info.difficulty = getDifficulty();
	info.timeLimit = getTime();
	info.length = getGameLength();
	guessInformation = [];
	//Set seed
	if (seed) info.seed = seed;
	else info.seed = `${info.difficulty}-${info.timeLimit}-${getAvailableMaps().includes(1) ? "1" : "0"}${getAvailableMaps().includes(2) ? "1" : "0"}${getAvailableMaps().includes(3) ? "1" : "0"}-${info.length}-`;

	//Reset score element:
	const scoreElement = document.getElementById("score") as HTMLSpanElement;
	scoreElement.innerHTML = info.score.toString();

	//Get images
	imageData = getImages(getIndexes());
	if (imageData.length == 0) return false;

	updateInfo();
	//Load first image
	loadImage(imageData[currentImg].src, info.timeLimit);
	//Setup guess button functionality
	document.addEventListener("keydown", (e) => {
		if (e.code === "Space" && getGuessing()) {
			guessMade();
		}
	});
	const guessButton = document.getElementById("guessBtn") as HTMLButtonElement;
	guessButton?.addEventListener("click", () => {
		guessMade();
	});
	//Import all images
	var element = document.getElementById("loadImg") as HTMLImageElement;
	if (element) {
		imageData.forEach((image) => {
			element.src = image.src;
		});
	}
	//Timer interval
	setInterval(() => {
		if (getGuessing()) {
			currentTime += 10;
			if (currentTime >= info.timeLimit) hideImage();
		}
	}, 10);

	//console.log('Time: ' + info.timeLimit);
	return true;
}
// function when someone presses guess or hits spacebar
function guessMade() {
	//Check map
	var currentInfo: guessInfo = {} as guessInfo;
	var currentMap = getMap();
	var marker = getMarker();
	if (!marker) {
		toast.error("You have not selected a location to guess.");
		return;
	}
	//Get locations
	var userLocation = [Math.round(marker.getLatLng().lat), Math.round(marker.getLatLng().lng)];
	var imageLocation = [imageData[currentImg]["x"], imageData[currentImg]["y"]];
	if (imageData[currentImg]["map"] == currentMap) {
		//Correct map, calculate score
		//Calculate distance
		var distance = Math.sqrt(Math.pow(userLocation[0] - imageLocation[0], 2) + Math.pow(userLocation[1] - imageLocation[1], 2));
		currentInfo.distance = Math.round(distance);
		//Remove 5 to account for image precision error
		if (distance - 10 / info.difficulty < 0) distance = 0;
		else distance -= 10 / info.difficulty;
		//Calculate score
		var score = Math.round(0.0425 * Math.pow(distance, 2) - 30 * distance + 5000);
		if (score <= 0) score = 0;
		if (distance > 300) score = 0;
	} else {
		//Wrong map, so no points
		var score = 0;
		currentInfo.distance = -1;
		var imageLocation = [imageData[currentImg]["x"], imageData[currentImg]["y"]];
	}
	//Add to guess information
	currentInfo.score = score;
	currentInfo.location = userLocation;
	currentInfo.map = currentMap;
	currentInfo.imageData = imageData[currentImg];
	currentInfo.time = currentTime;
	guessInformation.push(currentInfo);
	//Update score
	info.score += score;
	const scoreElement = document.getElementById("score") as HTMLSpanElement;
	scoreElement.innerHTML = info.score.toString();
	//Show the guess popup
	showGuess(currentInfo);
}

function getImages(indexes: number[]) {
	var images: location[] = [];
	var usedIndexes: number[] = [];
	var availableImages: location[] = [];
	var maps = getAvailableMaps();
	var difficulty = info.difficulty;
	if (indexes.length > 0) {
		indexes.forEach((index) => {
			if (locationData[index]) {
				images.push(locationData[index]);
			}
		});
		return images;
	}
	locationData.forEach((location) => {
		if ((location.difficulty.includes(difficulty) || difficulty == 5) && maps.includes(location.map)) {
			availableImages.push(location);
		}
	});
	if (availableImages.length < info.length) {
		toast.error("Not enough images in selected difficulty and map(s)");
		return [];
	}
	for (let i = 0; i < info.length; i++) {
		var index = 0;
		while (true) {
			index = Math.floor(Math.random() * availableImages.length);
			if (!usedIndexes.includes(index)) {
				images.push(availableImages[index]);
				usedIndexes.push(index);
				info.seed += locationData.indexOf(availableImages[index]) + ".";
				break;
			}
		}
	}
	//Remove last .
	info.seed = info.seed.slice(0, info.seed.lastIndexOf("."));
	return images;
}

function loadImage(src: string, timeLimit: number): void {
	//console.log('Time limit: ' + timeLimit);
	var element = document.getElementById("locationImg") as HTMLImageElement;
	element.src = src;
	//Reset the time counter
	currentTime = 0;
}

function hideImage(): void {
	var img = document.getElementById("locationImg") as HTMLImageElement;
	if (img!.src.includes("TimeIsUp.png")) return;
	let element = document.getElementById("locationImg") as HTMLImageElement;
	if (element) element.src = "./TimeIsUp.png";
}

export function nextImage() {
	if (currentImg == info.length - 1) {
		showEnd();
		return;
	}
	currentImg += 1;
	loadImage(imageData[currentImg]["src"], info.timeLimit);
	removeMarker();
}

//Export values
export function getImageData() {
	return imageData;
}
export function getImgNumber() {
	return currentImg;
}
export function getGameInformation() {
	return info;
}
export function getGuessInformation() {
	return guessInformation;
}
export function getCurrentTime() {
	return currentTime;
}
