/// this file handles constants.
import L, {TileLayer, type LatLngBoundsLiteral, type TileLayerOptions} from "leaflet";

export const bounds: LatLngBoundsLiteral = [
	[-256, 0],
	[0, 256]
];
//Map background colours
export const brightsandsColor: string = "#070d1b";
export const crescentfallsColor: string = "#020619";

// pixel size divided by map length in meters.
export const scaleFactor: number = 2048 / 1400;

export const tileLayerOptions: TileLayerOptions = {
	minZoom: 0,
	minNativeZoom: 0,
	maxZoom: 7,
	maxNativeZoom: 5,
	tileSize: 256,
	noWrap: true
};
export const tilelayerURL = (map: number) => {
	return `/map-images/${map}/{z}/{x}/{y}.png`;
};
