<template>
	<section class="map-container">
		<div class="map-selector-container">
			<MapSelector :gameOptions="gameOptions" />
		</div>
		<div id="GuessMap"></div>
	</section>
</template>

<script lang="ts">
	import L, {TileLayer, Marker} from "leaflet";
	import {bounds, tileLayerOptions, tilelayerURL, createIcon} from "../../mapConstants";
	import "leaflet-responsive-popup";
	import MapSelector from "../common/MapSelector.vue";
	import {defineComponent, type PropType} from "vue";
	import type {PlayerDataType} from "@/multiplayer";
	import {App} from "@/multiplayer";

	import {emitter, toast} from "@/main";
	import type {locationType, gameInfoType, guessInfoType} from "@/views/FortunaGuessrView.vue";
	export default defineComponent({
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
			},
			currentRound: {
				type: Number,
				required: true
			},
			location: {
				type: Object as PropType<locationType>,
				required: true
			}
		},
		mounted() {
			console.log("Created showguess map for round " + this.currentRound);
			let map = L.map("GuessMap", {
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
				console.log("Updated playerlist in showguesses map");
				this.ClearLayers();
				this.DisplayGuesses(map);
				this.AddCorrectMarker(map);
			});
		},
		methods: {
			ClearLayers() {
				console.log("Clearing layers");
				for (let i = 0; i < this.currentLayers.length; i++) {
					this.currentLayers[i].remove();
				}
				this.currentLayers = [] as L.Layer[];
			},
			DisplayGuesses(map: L.Map) {
				console.log("Displaying guesses");
				//Add new markers
				console.log("Playerlist: ", App.playerList);
				console.log("Current round: ", this.currentRound);
				App.playerList.forEach((player) => {
					console.log(player.gameData.guesses);
					let guess = player.gameData.guesses[this.currentRound] as guessInfoType | null;
					console.log("Guess: ", guess);
					if (guess && guess.map == this.mapNumber) {
						let marker = L.marker(L.latLng(guess.location[0], guess.location[1]), {
							icon: createIcon(this.currentRound),
							title: player.name + "'s guess"
						});
						marker.bindPopup(L.responsivePopup().setContent(player.name + "'s guess"));
						marker.on("click", () => {
							marker.openPopup();
						});
						this.currentLayers.push(marker);
						marker.addTo(map);
					}
				});
			},
			AddCorrectMarker(map: L.Map) {
				console.log("Adding correct marker");
				if (this.location.map == this.mapNumber) {
					console.log("Adding correct marker");
					let correctMarker = L.marker(L.latLng(this.location.x, this.location.y), {
						icon: createIcon(this.currentRound, "correct"),
						title: "Correct location",
						riseOnHover: true
					});
					correctMarker.bindPopup(L.responsivePopup().setContent("Correct location"));
					correctMarker.on("click", () => {
						correctMarker?.openPopup();
					});
					correctMarker.addTo(map);
					this.currentLayers.push(correctMarker);
					//Add line between guess and correct location
					let guess = App.myPlayerData.gameData.guesses[this.currentRound] as guessInfoType | null;
					console.log("Guess: ", guess);
					if (guess) {
						if (guess.map == this.mapNumber) {
							console.log("Adding line between guess and correct location");
							let line = L.polyline(
								[
									[guess.location[0], guess.location[1]],
									[this.location.x, this.location.y]
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
	});
</script>

<style scoped lang="less">
	.map-container {
		width: 48rem;
		height: 48rem;
	}

	#GuessMap {
		width: 100%;
		height: 100%;
		z-index: 0;
		background-color: #081021;
	}
</style>
