<template>
	<section class="map-container">
		<div class="map-selector-container">
			<MapSelector />
		</div>
		<div id="GameMap"></div>
	</section>
</template>

<script lang="ts">
	import L, {TileLayer} from "leaflet";
	import {bounds, tileLayerOptions, tilelayerURL} from "../../mapConstants";
	import MapSelector from "../common/MapSelector.vue";
	import {defineComponent} from "vue";

	import {emitter, toast} from "@/main";
	export default defineComponent({
		components: {
			MapSelector
		},
		data: () => ({
			map: null as L.Map | null
		}),
		mounted() {
			console.log("Creating game map");
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
			map.addLayer(L.tileLayer(tilelayerURL(1), tileLayerOptions));
			emitter.off("changeMap");
			emitter.on("changeMap", (mapNumber: number) => {
				let amountOfLayers = 0;
				map.eachLayer((layer) => {
					if (layer instanceof TileLayer == true) {
						if (map.hasLayer(layer)) map.removeLayer(layer);
					}
					amountOfLayers++;
				});
				map.addLayer(L.tileLayer(tilelayerURL(mapNumber), tileLayerOptions));
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
	}
</style>
