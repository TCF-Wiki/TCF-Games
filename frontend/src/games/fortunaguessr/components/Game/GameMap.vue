<template>
	<section class="map-container">
		<div class="map-selector-container">
			<MapSelector :gameOptions="gameOptions" />
		</div>
		<div id="GameMap"></div>
	</section>
</template>

<script lang="ts">
	import L, {TileLayer, type LeafletEvent} from "leaflet";
	import {bounds, tileLayerOptions, tilelayerURL, createIcon} from "../../mapConstants";
	import MapSelector from "../common/MapSelector.vue";
	import {defineComponent, type PropType} from "vue";
	import type {gameInfoType} from "@/views/FortunaGuessrView.vue";

	import {emitter, toast} from "@/main";
	export default defineComponent({
		components: {
			MapSelector
		},
		data: () => ({
			map: null as L.Map | null,
			mapNumber: 1
		}),
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
			isTimeUp: {
				type: Boolean,
				required: true
			},
			currentRound: {
				type: Number,
				required: true
			}
		},
		mounted() {
			console.log("Creating game map");
			this.mapNumber = this.gameOptions.maps[0];
			let map = L.map("GameMap", {
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
			map.addLayer(L.tileLayer(tilelayerURL(this.mapNumber), tileLayerOptions));
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
			});

			const frame = this;
			let currentMarker: L.Marker | null;
			map.on("click", function (event) {
				if (frame.isTimeUp) return;
				// place our marker
				//Set marker icon
				const icon = createIcon(frame.currentRound);

				if (currentMarker) map.removeLayer(currentMarker);
				currentMarker = L.marker(event.latlng, {icon: icon, riseOnHover: true /**, title: "Location: (" + event.latlng.lat + "; " + event.latlng.lng + ")"*/}).addTo(map);
				// emit our guess event
				emitter.emit("PlacedGuess", {lat: event.latlng.lat, lng: event.latlng.lng, map: frame.mapNumber});
			});
		}
	});
</script>

<style scoped lang="less">
	.map-container {
		width: 48rem;
		height: 48rem;
	}

	#GameMap {
		width: 100%;
		height: 100%;
		z-index: 0;
		background-color: #081021;
		border-bottom-right-radius: 3rem;
		border-bottom-left-radius: 3rem;
	}
</style>
