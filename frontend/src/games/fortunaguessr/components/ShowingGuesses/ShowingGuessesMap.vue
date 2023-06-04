<template>
	<section class="map-container">
		<div class="map-selector-container">
			<MapSelector state="showguess" />
		</div>
		<div id="GuessMap"></div>
	</section>
</template>

<script lang="ts">
	import L, {type TileLayer} from "leaflet";
	import {bounds, map1TileLayer, map2TileLayer, map3TileLayer} from "../../mapConstants";
	import MapSelector from "../common/MapSelector.vue";
	import {defineComponent} from "vue";

	import {emitter} from "@/main";
	export default defineComponent({
		components: {
			MapSelector
		},
		async mounted() {
			console.log("Created showguess map");
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

			initiateMapToMapNumber(1).addTo(map);

			function initiateMapToMapNumber(mapNumber: number): TileLayer {
				// this function initialises the map to a specified map number.
				if (mapNumber == 1) {
					if (map.hasLayer(map2TileLayer)) {
						map.removeLayer(map2TileLayer);
					}
					if (map.hasLayer(map3TileLayer)) {
						map.removeLayer(map3TileLayer);
					}

					return map1TileLayer;
				} else if (mapNumber == 2) {
					if (map.hasLayer(map1TileLayer)) {
						map.removeLayer(map1TileLayer);
					}
					if (map.hasLayer(map3TileLayer)) {
						map.removeLayer(map3TileLayer);
					}
					return map2TileLayer;
				} else if (mapNumber == 3) {
					if (map.hasLayer(map1TileLayer)) {
						map.removeLayer(map1TileLayer);
					}
					if (map.hasLayer(map2TileLayer)) {
						map.removeLayer(map2TileLayer);
					}
					return map3TileLayer;
				} else {
					return map1TileLayer;
				}
			}

			emitter.on("changeMapShowGuess", (mapNumber: number) => {
				initiateMapToMapNumber(mapNumber).addTo(map);
			});

			emitter.on("NextRound", () => {
				console.log("Destroy after done, showguesses");
				map.off();
				map.remove();
				console.log(map);
			});
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
