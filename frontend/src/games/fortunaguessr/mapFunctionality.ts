import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
//Images
const crescentfallsImg: string = "/Crescentfalls.png";
const brightsandsImg: string = "/Brightsands.png";
const tharisIslandImg: string = "/TharisIsland.png";
//Setup variables
var currentMarker: Leaflet.Marker | null;
var mapObj: Leaflet.Map;
var imageOverlay: Leaflet.ImageOverlay;
var currentMap: number = 1;
var guessLocations: number[][] = [];
var mapWidth: number;

//Import
import MapVue from "./components/GameMap.vue";
import {getGuessing, getAvailableMaps} from "./main";
import {getImgNumber} from "./gameFunctionality";

//Function run on map load
export async function load(map: Leaflet.Map, mapOverlay: Leaflet.ImageOverlay, width: number) {
	//console.log('Loading map...');
	//Reset variables
	mapObj = map;
	imageOverlay = mapOverlay;
	mapWidth = width;
	guessLocations = [];
	currentMap = 1;
	switchMap(getAvailableMaps()[0]);
	//Set map object so it can be refound...
	mapObj = map;
	imageOverlay = mapOverlay;
	mapWidth = width;
	//Setup zoom
	map.setView([width / 2, width / 2], 0, {animate: false});
	getZoom(map.getContainer().clientWidth, map);
	//Map size changed, update zoom
	map.on("resize", (e: any) => {
		getZoom(e.newSize.x, map);
	});

	//Place a marker on click
	map.on("click", (event) => {
		if (getGuessing()) {
			//Set marker icon
			const icon = Leaflet.icon({
				iconUrl: `/marker-icon-guess-${getImgNumber() + 1}.png`,
				iconSize: [26, 37],
				iconAnchor: [13, 37],
				popupAnchor: [1, -34]
			});

			if (currentMarker) map.removeLayer(currentMarker);
			currentMarker = Leaflet.marker(event.latlng, {icon: icon, riseOnHover: true}).addTo(map);
			guessLocations.push([event.latlng.lat, event.latlng.lng]);
		}
	});

	//Setup map switch button
	const mapSwitchButton = document.getElementById("mapSwitch") as HTMLButtonElement;
	document.addEventListener("keydown", (e) => {
		if (e.code === "KeyM") {
			if (getAvailableMaps().length < 2) return;
			var newMap = currentMap + 1;
			if (newMap > 3) newMap = 1;
			switchMap(newMap);
		}
	});
	mapSwitchButton?.addEventListener("click", () => {
		var newMap = currentMap + 1;
		if (newMap > 3) newMap = 1;
		switchMap(newMap);
	});
}

//Get zoom function...
export function getZoom(containerWidth: number, map: Leaflet.Map) {
	//console.log('Container width: ' + containerWidth);
	var minZoom = Math.log(containerWidth / MapVue.width) / Math.LOG2E - 1;
	var maxZoom = Math.log(containerWidth / (MapVue.width / 250)) / Math.LOG2E - 1;
	map.options.minZoom = minZoom;
	map.options.maxZoom = maxZoom;
	map.options.zoom = minZoom;
	map.setZoom(minZoom);
}

export function switchMap(newMap: number) {
	if (currentMap == newMap) return;
	removeMarker();
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
	currentMap = newMap;
}

export function removeMarker() {
	if (currentMarker) {
		currentMarker.remove();
		currentMarker = null;
	}
}

export function resetMap() {
	//console.log('Resetting map...');
	removeMarker();
	guessLocations = [];
	imageOverlay.remove();
	currentMap = 1;
	mapObj.remove();
}

//Functions for getting variables in other scripts
export function getMapObj() {
	return mapObj;
}
export function getMap() {
	return currentMap;
}
export function getMarker() {
	return currentMarker;
}
export function getLocations() {
	return guessLocations;
}
