<template>
	<section class="container">
		<h1>End</h1>
		<EndMap :gameOptions="gameOptions"/>
		<button @click="restartGame()" v-if="showControls">Restart Game</button>
		<button @click="backToLobby()" v-if="showControls">Back to Lobby</button>
	</section>
</template>
<script lang="ts">
	import {defineComponent, type PropType} from "vue";
	import {emitter, toast} from "@/main";
	import type {locationType, guessInfoType, gameInfoType} from "@/views/FortunaGuessrView.vue";

	import EndMap from "./End/EndMap.vue";
	import {App} from "@/multiplayer";
	import {GameApp} from "../multiplayer";

	export default defineComponent({
		name: "End",
		props: {
			gameOptions: {
				type: Object as PropType<gameInfoType>,
				required: true
			},
		},
		data: () => ({
			showControls: App.host
		}),
		methods: {
			restartGame() {
				console.log("Restarting game");
				emitter.emit("StartGameWithOptions", null);
			},
			backToLobby() {
				console.log("Back to lobby");
				GameApp.SendBackToLobby();
			}
		},
		mounted() {
			emitter.on("HostChanged", () => {
				this.showControls = App.host;
			});
		},
		components: {EndMap}
	});
</script>
<style scoped></style>
