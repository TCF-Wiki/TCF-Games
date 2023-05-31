<template>
	<main>
		<nav>
			<button class="tab button" id="mapSwitch">Switch map</button>
		</nav>
		<div id="guess-map"></div>
	</main>
</template>

<style scoped>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	nav {
		height: 4vh;
		width: 80%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}
	.tab {
		width: 100%;
		height: 100%;
		margin: 0;
		clip-path: polygon(0 33%, 3% 0, 100% 0, 100% 100%, 0 100%);
	}
	#guess-map {
		position: relative;
		width: 80%;
		height: 0;
		padding-bottom: 80%;
		background: #081021;
		border: 0.2vh solid var(--primary-accent);
		clip-path: polygon(0 0, 100% 0, 100% 97%, 97% 100%, 0 100%);
	}
</style>

<script lang="ts">
	//Import leaflet stuff...
	import "leaflet/dist/leaflet.css";
	import Leaflet from "leaflet";

	//Import functions
	import {getZoom} from "../mapFunctionality";
	import {getImageData, getImgNumber, getGuessInformation, getGameInformation} from "../gameFunctionality";
	import type {guessInfo} from "../gameFunctionality";
	import {getAvailableMaps, getGameLength} from "../main";

	//Import multiplayer stuff...
	import {GameIO, GameApp} from "../multiplayer";
	//Images
	const crescentfallsImg: string = "/Crescentfalls.png";
	const brightsandsImg: string = "/Brightsands.png";
	const tharisIslandImg = "/TharisIsland.png";
	//Variables
	var mapWidth = 2048;
	var mapObj: Leaflet.Map;
	var imageOverlay: Leaflet.ImageOverlay;
	var currentMap: number = 1;

	//Markers...
	var correctMarker: Leaflet.Marker;
	var line: Leaflet.Polyline | null;
	var correctMap: number;
	var map01Markers: Leaflet.LayerGroup;
	var map02Markers: Leaflet.LayerGroup;
	var map03Markers: Leaflet.LayerGroup;
	//Icons

	//Setup
	export default {
		name: "GuessMap",
		data() {
			return {};
		},
		//This .vue has been mounted to the page
		mounted() {
			const correctIcon = Leaflet.icon({
				iconUrl: `/marker-icon-correct-${getImgNumber() + 1}.png`,
				iconSize: [26, 37],
				iconAnchor: [13, 37],
				popupAnchor: [1, -34]
			});
			//console.log('Guess map mounted');
			//Create leaflet map with default settings
			const map = Leaflet.map("guess-map", {
				crs: Leaflet.CRS.Simple,
				maxBounds: [
					[mapWidth, 0],
					[0, mapWidth]
				],
				zoomDelta: 0.5,
				zoomSnap: 0.5,
				wheelPxPerZoomLevel: 40,
				attributionControl: false,
				maxBoundsViscosity: 0.75,
				center: [mapWidth / 2, mapWidth / 2],
				doubleClickZoom: false,
				zoomControl: true
			});
			mapObj = map;
			//Set zoom
			map.setView([mapWidth / 2, mapWidth / 2], 0, {animate: false});
			getZoom(map.getContainer().clientWidth, map);
			//Reset old variables...
			if (line) {
				line.remove();
				line = null;
			}
			if (correctMarker) {
				correctMarker.remove();
			}
			if (map01Markers) map01Markers.clearLayers();
			if (map02Markers) map02Markers.clearLayers();
			if (map03Markers) map03Markers.clearLayers();
			//Set map image
			imageOverlay = Leaflet.imageOverlay(
				brightsandsImg,
				[
					[mapWidth, 0],
					[0, mapWidth]
				],
				{pane: "mapPane"}
			).addTo(map);
			//Setup guess markers
			map01Markers = Leaflet.layerGroup();
			map02Markers = Leaflet.layerGroup();
			map03Markers = Leaflet.layerGroup();
			updateMarkers();
			//Load correct marker
			var imageInfo = getImageData()[getImgNumber()];
			//console.log(imageInfo);
			correctMarker = Leaflet.marker([imageInfo.x, imageInfo.y], {
				icon: correctIcon,
				riseOnHover: true
			}).addTo(map);
			correctMap = imageInfo.map;
			var currentGuess = getGuessInformation()[getImgNumber()];

			if (currentGuess.map == correctMap) {
				line = Leaflet.polyline([[currentGuess.location[0], currentGuess.location[1]], correctMarker.getLatLng()], {color: "red", dashArray: "5"});
			}
			//Switch to correct location map
			switchMap(imageInfo.map);

			//Resize?
			map.on("resize", (e) => {
				getZoom(e.newSize.x, map);
			});

			//Switch map button
			//Setup map switch button
			const mapSwitchButton = document.getElementById("mapSwitch") as HTMLButtonElement;
			if (getAvailableMaps().length < 2) {
				document.getElementById("mapSwitch")!.style.visibility = "hidden";
				switchMap(getAvailableMaps()[0]);
			}
			document.addEventListener("keydown", (e) => {
				if (e.code === "KeyM") {
					if (getAvailableMaps().length < 3) return;
					var newMap = currentMap + 1;
					if (newMap > 3) newMap = 1;
					switchMap(newMap);
				}
			});
			mapSwitchButton?.addEventListener("click", () => {
				if (getAvailableMaps().length < 3) return;
				var newMap = currentMap + 1;
				if (newMap > 3) newMap = 1;
				switchMap(newMap);
			});
		}
	};

	//update markers
	export function updateMarkers() {
		//Remove all markers
		map01Markers.clearLayers();
		map02Markers.clearLayers();
		map03Markers.clearLayers();
		//Multiplayer?
		if (GameApp.App.gameId != "0") {
			//Add all markers
			var allGuessInfo: guessInfo[] = [];
			GameApp.players.forEach((player) => {
				var info = player.guessInfo[getImgNumber()];
				if (info) {
					allGuessInfo.push(info);
				}
			});
			allGuessInfo.forEach((guess: guessInfo, index) => {
				const guessIcon = Leaflet.icon({
					iconUrl: `/marker-icon-guess-${getImgNumber() + 1}.png`,
					iconSize: [26, 37],
					iconAnchor: [13, 37],
					popupAnchor: [1, -34]
				});
				var mapLayer = guess.map == 1 ? map01Markers : guess.map == 2 ? map02Markers : map03Markers;
				var marker = Leaflet.marker([guess.location[0], guess.location[1]], {
					icon: guessIcon,
					riseOnHover: true
				}).addTo(mapLayer);
				marker.bindPopup(GameApp.players[allGuessInfo.indexOf(guess)].playerName);
			});
		} else {
			//Singleplayer
			const guessIcon = Leaflet.icon({
				iconUrl: `/marker-icon-guess-${getImgNumber() + 1}.png`,
				iconSize: [26, 37],
				iconAnchor: [13, 37],
				popupAnchor: [1, -34]
			});

			var guessInfo = getGuessInformation()[getImgNumber()];
			var mapLayer = guessInfo.map == 1 ? map01Markers : guessInfo.map == 2 ? map02Markers : map03Markers;
			Leaflet.marker([guessInfo.location[0], guessInfo.location[1]], {
				icon: guessIcon,
				riseOnHover: true
			}).addTo(mapLayer);
		}
	}

	//Change map
	function switchMap(newMap: number) {
		//console.log('switch map');
		if (!getAvailableMaps().includes(newMap)) {
			newMap += 1;
			if (newMap > 3) newMap = 1;
		}
		//Image overlay
		if (newMap == 1) {
			var img = brightsandsImg;
		} else if (newMap == 2) {
			var img = crescentfallsImg;
		} else {
			var img = tharisIslandImg;
		}
		imageOverlay.remove();
		imageOverlay = Leaflet.imageOverlay(
			img,
			[
				[0, mapWidth],
				[mapWidth, 0]
			],
			{pane: "mapPane"}
		).addTo(mapObj);
		//Layer groups
		if (newMap == 1) {
			map01Markers.addTo(mapObj);
			map02Markers.removeFrom(mapObj);
			map03Markers.removeFrom(mapObj);
		} else if (newMap == 2) {
			map02Markers.addTo(mapObj);
			map01Markers.removeFrom(mapObj);
			map03Markers.removeFrom(mapObj);
		} else {
			map03Markers.addTo(mapObj);
			map01Markers.removeFrom(mapObj);
			map02Markers.removeFrom(mapObj);
		}
		//Correct marker
		if (newMap == correctMap) {
			if (line) line.addTo(mapObj);
			correctMarker.addTo(mapObj);
		} else {
			if (line) line.removeFrom(mapObj);
			correctMarker.removeFrom(mapObj);
		}

		//Map variable
		currentMap = newMap;
	}

	export function resetGuessMap() {
		//console.log('Resetting guess map...');
		map01Markers.remove();
		map02Markers.remove();
		map03Markers.remove();
		correctMarker.remove();
		imageOverlay.remove();
		currentMap = 1;
		if (line) line.remove();
		line = null;
		mapObj.remove();
	}
</script>
