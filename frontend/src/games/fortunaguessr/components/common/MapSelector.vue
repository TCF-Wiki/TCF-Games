<template>
	<div class="map-selector" :style="{'--amount-of-maps': gameOptions.maps.length}" v-if="gameOptions.maps.length > 1">
		<button v-if="gameOptions.maps.includes(1)" type="button" @click="requestMap(1)">Bright Sands</button>
		<button v-if="gameOptions.maps.includes(2)" type="button" @click="requestMap(2)">Crescent Falls</button>
		<button v-if="gameOptions.maps.includes(3)" type="button" @click="requestMap(3)">Tharis Island</button>
	</div>
</template>

<script lang="ts">
	import {defineComponent, type PropType} from "vue";
	import {emitter, toast} from "@/main";
	import { type gameInfoType } from "@/views/FortunaGuessrView.vue";
	export default defineComponent({
		emits: ["changeMap"],
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
		},
		methods: {
			requestMap(mapNumber: number) {
				emitter.emit("changeMap", mapNumber);
			}
		}
	});
</script>

<style scoped lang="less">
	.map-selector {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(var(--amount-of-maps), 1fr);
	}

	button {
		margin: 0;
		border-radius: 0;
		background-color: var(--color-surface-4);
		color: var(--color-base);
		padding: var(--space-sm);

		transition: background 0.3s ease-in-out;

		&:hover {
			background-color: var(--color-surface-1);
		}

		&:first-of-type {
			border-top-left-radius: 2rem;
		}

		&:last-of-type {
			border-top-right-radius: 2rem;
		}

		&:not(:last-of-type) {
			border-right: 1px solid var(--border-color-base);
		}
	}
</style>
