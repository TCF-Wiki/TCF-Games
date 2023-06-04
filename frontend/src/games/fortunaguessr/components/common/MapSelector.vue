<template>
	<div class="map-selector">
		<button type="button" @click="requestMap(1)">Bright Sands</button>
		<button type="button" @click="requestMap(2)">Crescent Falls</button>
		<button type="button" @click="requestMap(3)">Tharis Island</button>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {emitter, toast} from "@/main";
	export default defineComponent({
		props: ["state"],
		emits: ["changeMap"],
		methods: {
			requestMap(mapNumber: number) {
				if (this.state == "game") emitter.emit("changeMapGame", mapNumber);
				if (this.state == "showguess") emitter.emit("changeMapShowGuess", mapNumber);
				if (this.state == "end") emitter.emit("changeMapEnd", mapNumber);
			}
		}
	});
</script>

<style scoped lang="less">
	.map-selector {
		width: 100%;

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: var(--space-md);
		border: 1px solid var(--border-color-base);
		border-bottom: none;
	}

	button {
		padding: 0;
		margin: 0;

		background-color: var(--color-surface-4);
		color: var(--color-base);
		padding: var(--space-sm);

		transition: background 0.3s ease-in-out;

		&:hover {
			background-color: var(--color-surface-1);
		}
	}
</style>
