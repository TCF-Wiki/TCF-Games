<template>
	<main>
		<nav>
			<button class="tab button" id="mapSwitch">Switch map</button>
		</nav>
		<div id="leaf-map"></div>
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
	#leaf-map {
		position: relative;
		width: 80%;
		height: 0;
		padding-bottom: 80%;
		border: 0.2vh solid var(--primary-accent);
		clip-path: polygon(0 0, 100% 0, 100% 97%, 97% 100%, 0 100%);
		background: #081021;
	}
</style>

<script lang="ts">
	//Import leaflet stuff...
	import "leaflet/dist/leaflet.css";
	import Leaflet from "leaflet";
	//Import load function from marker.ts
	import {load, switchMap} from "../mapFunctionality";
	import {getAvailableMaps} from "../main";

	//Images
	const crescentfallsImg: string = "/Crescentfalls.png";
	const brightsandsImg: string = "/Brightsands.png";
	const tharisIslandImg = "/TharisIsland.png";

	var mapWidth = 2048;
	//Setup
	export default {
		name: "Map",
		width: mapWidth,
		data() {
			return {};
		},
		//This .vue has been mounted to the page
		mounted() {
			//console.log('Game map mounted');
			//Create leaflet map with default settings
			const map = Leaflet.map("leaf-map", {
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
			//Set map image
			var mapOverlay = Leaflet.imageOverlay(
				brightsandsImg,
				[
					[mapWidth, 0],
					[0, mapWidth]
				],
				{pane: "mapPane"}
			).addTo(map);
			//Run mapFunctionality.ts load function
			load(map, mapOverlay, mapWidth);

			//Hide button if only one map is available
			if (getAvailableMaps().length < 2) {
				document.getElementById("mapSwitch")!.style.visibility = "hidden";
				switchMap(getAvailableMaps()[0]);
			}
		}
	};
</script>
