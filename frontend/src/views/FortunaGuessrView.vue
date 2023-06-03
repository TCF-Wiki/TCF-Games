<template></template>

<script lang="ts">
	//Import dependencies
	import "leaflet/dist/leaflet.css";
	import "leaflet";
	import {app} from "@/main";
	const toast = app.config.globalProperties.$toast;

	//Create vue app
	export default {
		name: "FortunaGuessrView",
		data: () => ({
			select: true,
			playing: false,
			showingGuess: false,
			end: false
		}),
		mounted() {}
	};
</script>
