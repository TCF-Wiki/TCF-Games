<template>
	<div id="maps">
		<div class="endMap" id="map01"></div>
		<div class="endMap" id="map02"></div>
		<div class="endMap" id="map03"></div>
	</div>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css" />
</template>
<style>
	#maps {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50%;
	}
	.endMap {
		width: 28%;
		height: 0;
		padding-bottom: 28%;
		margin: 2.5%;
		border: 0.2vh solid var(--primary-accent);
		background: #081021;
	}
	.leaflet-div-icon {
		background: transparent;
		border: none;
	}

	.leaflet-marker-icon .number {
		position: relative;
		top: -37px;
		font-size: 12px;
		width: 25px;
		text-align: center;
	}
</style>
<script lang="ts">
	//Import leaflet stuff...
	import "leaflet/dist/leaflet.css";
	import Leaflet from "leaflet";
	//Import images to use as default map background
	let brightsandsImg = "/Brightsands.png";
	let crescentfallsImg = "/Crescentfalls.png";
	let tharisIslandImg = "/TharisIsland.png";
	//Import functions
	import {getGuessInformation, type guessInfo} from "../gameFunctionality";
	import {getZoom} from "../mapFunctionality";
	import {getAvailableMaps} from "../main";

	//Setup leaflet markers

	//Layer groups
	var map01layers: Leaflet.LayerGroup = Leaflet.layerGroup();
	var map02layers: Leaflet.LayerGroup = Leaflet.layerGroup();
	var map03layers: Leaflet.LayerGroup = Leaflet.layerGroup();
	//Mounted:
	var width = 2048;
	export default {
		name: "EndMap",
		data() {
			return {};
		},
		mounted() {
			//Get data
			var guessInformation = getGuessInformation();
			//Create maps
			const map01 = Leaflet.map("map01", {
				crs: Leaflet.CRS.Simple,
				maxBounds: [
					[width, 0],
					[0, width]
				],
				zoomDelta: 0.5,
				zoomSnap: 0.5,
				wheelPxPerZoomLevel: 40,
				attributionControl: false,
				maxBoundsViscosity: 0.75,
				center: [width / 2, width / 2],
				doubleClickZoom: false,
				zoomControl: true
			});
			getZoom(map01.getContainer().clientWidth, map01);
			map01.fitBounds([
				[width, 0],
				[0, width]
			]);
			Leaflet.imageOverlay(
				brightsandsImg,
				[
					[width, 0],
					[0, width]
				],
				{pane: "mapPane"}
			).addTo(map01);

			const map02 = Leaflet.map("map02", {
				crs: Leaflet.CRS.Simple,
				maxBounds: [
					[width, 0],
					[0, width]
				],
				zoomDelta: 0.5,
				zoomSnap: 0.5,
				wheelPxPerZoomLevel: 40,
				attributionControl: false,
				maxBoundsViscosity: 0.75,
				center: [width / 2, width / 2],
				doubleClickZoom: false,
				zoomControl: true
			});
			getZoom(map02.getContainer().clientWidth, map02);
			map02.fitBounds([
				[width, 0],
				[0, width]
			]);
			Leaflet.imageOverlay(
				crescentfallsImg,
				[
					[width, 0],
					[0, width]
				],
				{pane: "mapPane"}
			).addTo(map02);

			const map03 = Leaflet.map("map03", {
				crs: Leaflet.CRS.Simple,
				maxBounds: [
					[width, 0],
					[0, width]
				],
				zoomDelta: 0.5,
				zoomSnap: 0.5,
				wheelPxPerZoomLevel: 40,
				attributionControl: false,
				maxBoundsViscosity: 0.75,
				center: [width / 2, width / 2],
				doubleClickZoom: false,
				zoomControl: true
			});
			getZoom(map03.getContainer().clientWidth, map03);
			map03.fitBounds([
				[width, 0],
				[0, width]
			]);
			Leaflet.imageOverlay(
				tharisIslandImg,
				[
					[width, 0],
					[0, width]
				],
				{pane: "mapPane"}
			).addTo(map03);

			//Layer groups
			map01layers.addTo(map01);
			map02layers.addTo(map02);
			map03layers.addTo(map03);
			//Add own markers
			addMarkers(guessInformation);

			//Hide map if not available this round
			var availableMaps = getAvailableMaps();
			if (!availableMaps.includes(1)) {
				var elem = document.getElementById("map01") as HTMLDivElement;
				elem.style.display = "none";
			}
			if (!availableMaps.includes(2)) {
				var elem = document.getElementById("map02") as HTMLDivElement;
				elem.style.display = "none";
			}
			if (!availableMaps.includes(3)) {
				var elem = document.getElementById("map03") as HTMLDivElement;
				elem.style.display = "none";
			}
		}
	};

	export function addMarkers(guessInfo: guessInfo[]) {
		map01layers.clearLayers();
		map02layers.clearLayers();
		map03layers.clearLayers();
		//Add markers to the maps
		guessInfo.forEach((data, index) => {
			var correctIcon = Leaflet.icon({
				iconUrl: `./marker-icon-correct-${index + 1}.png`,
				iconSize: [26, 37],
				iconAnchor: [13, 37],
				popupAnchor: [1, -34]
			});

			var guessIcon = Leaflet.icon({
				iconUrl: `./marker-icon-guess-${index + 1}.png`,
				iconSize: [26, 37],
				iconAnchor: [13, 37],
				popupAnchor: [1, -34]
			});

			//Set maps
			var guessMap = data.map == 1 ? map01layers : data.map == 2 ? map02layers : map03layers;
			var locationMap = data.imageData.map == 1 ? map01layers : data.imageData.map == 2 ? map02layers : map03layers;
			//Popup content
			var popupContent = `<img src='./${data.imageData.src}' height="154px" width="274px"/>`;
			//Create markers
			let m1 = Leaflet.marker([data.location[0], data.location[1]], {icon: guessIcon, riseOnHover: true}).addTo(guessMap);
			//m1.bindTooltip('1');
			m1.bindPopup(popupContent);
			let m2 = Leaflet.marker([data.imageData.x, data.imageData.y], {icon: correctIcon, riseOnHover: true}).addTo(locationMap);
			m2.bindPopup(popupContent);
			//Add line
			if (data.map == data.imageData.map) Leaflet.polyline([m1.getLatLng(), m2.getLatLng()], {color: "red"}).addTo(locationMap);
		});
	}
</script>
