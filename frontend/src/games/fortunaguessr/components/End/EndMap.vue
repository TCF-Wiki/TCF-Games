<template>
	<section class="map-container">
		<div class="map-selector-container">
			<MapSelector :gameOptions="gameOptions" />
		</div>
		<div id="EndMap" :class="{topRoundedCorners: gameOptions.maps.length == 1}"></div>
	</section>
</template>

<script lang="ts">
import L, {TileLayer, Marker} from "leaflet";
import {bounds, tileLayerOptions, tilelayerURL, createIcon} from "../../mapConstants";
import "leaflet-responsive-popup";
import MapSelector from "../common/MapSelector.vue";
import {defineComponent, type PropType} from "vue";
import {GameApp} from "../../multiplayer";
import type {PlayerDataType} from "@/multiplayer";
import {App} from "@/multiplayer";

import {emitter, toast} from "@/main";
import type {locationType, gameInfoType, guessInfoType} from "@/views/FortunaGuessrView.vue";
export default defineComponent({
	name: "EndMap",
	components: {
		MapSelector
	},
	data: () => ({
		currentLayers: [] as L.Layer[],
		mapNumber: 1
	}),
	props: {
		gameOptions: {
			type: Object as PropType<gameInfoType>,
			required: true
		}
	},
	mounted() {
		///console.log("Created end map");
		let map = L.map("EndMap", {
			crs: L.CRS.Simple,
			zoom: 1,
			minZoom: 1,
			maxZoom: 7,
			maxBounds: [
				[1024, -1024],
				[-1024, 1024]
			],
			zoomSnap: 0.05,
			wheelPxPerZoomLevel: 60,
			attributionControl: false
		}).setView([-128, 128], 1);
		map.zoomControl.setPosition("topright");
		map.fitBounds(bounds);
		this.mapNumber = this.gameOptions.maps[0];
		map.addLayer(L.tileLayer(tilelayerURL(this.mapNumber), tileLayerOptions));
		this.ClearLayers();
		this.DisplayGuesses(map);
		this.AddCorrectMarker(map);

		emitter.off("changeMap");
		emitter.on("changeMap", (mapNumber: number) => {
			this.mapNumber = mapNumber;
			let amountOfLayers = 0;
			map.eachLayer((layer) => {
				if (layer instanceof TileLayer == true) {
					if (map.hasLayer(layer)) map.removeLayer(layer);
				}
				amountOfLayers++;
			});
			map.addLayer(L.tileLayer(tilelayerURL(mapNumber), tileLayerOptions));
			this.ClearLayers();
			this.DisplayGuesses(map);
			this.AddCorrectMarker(map);
		});
		emitter.on("PlayerListUpdated", (playerList: PlayerDataType[]) => {
			if (GameApp.state != "End") return;
			///console.log("Updated playerlist in showguesses map");
			this.ClearLayers();
			this.DisplayGuesses(map);
			this.AddCorrectMarker(map);
		});

		emitter.on();
	},
	methods: {
		ClearLayers() {
			///console.log("Clearing layers");
			for (let i = 0; i < this.currentLayers.length; i++) {
				this.currentLayers[i].remove();
			}
			this.currentLayers = [] as L.Layer[];
		},
		DisplayGuesses(map: L.Map) {
			///console.log("Displaying guesses");
			//Add new markers
			///console.log("Playerlist: ", App.playerList);
			App.playerList.forEach((player) => {
				///console.log(player.gameData.guesses);
				player.gameData.guesses.forEach((guess: guessInfoType) => {
					///console.log("Guess: ", guess);
					if (guess && guess.map == this.mapNumber) {
						let marker = L.marker(L.latLng(guess.location[0], guess.location[1]), {
							icon: createIcon(guess.round),
							title: player.name + "'s guess for round " + (guess.round + 1)
						});
						marker.bindPopup(L.responsivePopup().setContent(player.name + "'s guess for round " + (guess.round + 1)));
						marker.on("click", () => {
							marker.openPopup();
						});
						this.currentLayers.push(marker);
						marker.addTo(map);
					}
				});
			});
		},
		AddCorrectMarker(map: L.Map) {
			///console.log("Adding correct marker");
			let locations = App.myPlayerData.gameData.guesses.map((guess: guessInfoType) => ({...guess.imageData, round: guess.round}));
			for (let location of locations) {
				///console.log("Location: ", location);
				if (location.map == this.mapNumber) {
					///console.log("Adding correct marker");
					let correctMarker = L.marker(L.latLng(location.x, location.y), {
						icon: createIcon(location.round, "correct"),
						title: "Correct location for round " + location.round,
						riseOnHover: true
					});
					correctMarker.bindPopup(L.responsivePopup().setContent("Correct location for round " + location.round));
					correctMarker.on("click", () => {
						correctMarker?.openPopup();
					});
					correctMarker.addTo(map);
					this.currentLayers.push(correctMarker);
					//Add line between guess and correct location
					let guess = App.myPlayerData.gameData.guesses[location.round] as guessInfoType;
					///console.log("Guess: ", guess);
					if (guess) {
						if (guess.map == this.mapNumber) {
							///console.log("Adding line between guess and correct location");
							let line = L.polyline(
								[
									[guess.location[0], guess.location[1]],
									[location.x, location.y]
								],
								{
									color: "var(--color-link)",
									weight: 4,
									opacity: 1,
									dashArray: "7"
								}
							);
							line.addTo(map);
							this.currentLayers.push(line);
						}
					}
				}
			}
		}
	}
});
</script>

<style scoped lang="less">
.map-container {
	width: 100%;
	aspect-ratio: 1 / 1;
}

#EndMap {
	width: 100%;
	height: 100%;
	z-index: 0;
	background-color: #081021;
	box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

	border-bottom-left-radius: 2rem;
	border-bottom-right-radius: 2rem;
	&.topRoundedCorners {
		border-top-right-radius: 2rem;
		border-top-left-radius: 2rem;
	}
}
</style>
