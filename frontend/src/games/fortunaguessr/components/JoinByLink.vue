<template>
	<section role="dialog" v-if="showModal">
		<button class="close" @click.prevent="closeDialog">&times;</button>
		<h2>Joining Game {{ gameId }}</h2>
		<form autocomplete="off">
			<div class="text-input">
				<input id="playerNameInput2" type="text" v-model="name" placeholder="Username" required minlength="3" />
				<label for="playerNameInput2"> Username </label>
			</div>
			<button @click.prevent="joinGame($event)" class="button" type="submit">Join Game</button>
		</form>
	</section>
	<div id="background" v-if="showModal" @click.prevent="closeDialog"></div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {GameApp, GameIO} from "../multiplayer";
	import {deleteAllUrlParameter} from "../main";
	export default defineComponent({
		name: "JoinByLink",
		data: function () {
			return {
				showModal: false,
				gameId: "",
				name: ""
			};
		},
		mounted: function () {
			let urlParams = new URLSearchParams(window.location.search);
			let roomId = urlParams.get("join");
			if (roomId) {
				this.gameId = roomId;
				this.showModal = true;
			}
		},
		methods: {
			joinGame: function (e: Event) {
				GameApp.Player.onJoinClick(Number(this.gameId), this.name);
				this.showModal = false;
				deleteAllUrlParameter();
			},
			closeDialog: function () {
				this.showModal = false;
				deleteAllUrlParameter();
			}
		}
	});
</script>

<style scoped>
	@import url("@/assets/text-input.css");

	#background {
		position: fixed;
		width: 100%;
		opacity: 0.8;
		top: 0px;
		margin: 0px;
		min-height: 200px;
		height: 100%;
		background-color: #000;
		filter: blur(100);
	}

	section {
		position: fixed;
		left: 50%;
		top: 50%;
		-ms-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		width: fit-content;
		height: fit-content;
		padding: 2em;
		background-color: var(--primary);
		border: 2px solid var(--primary-accent);
		color: var(--secondary);
		z-index: 200;

		display: flex;
		justify-content: center;
		align-content: center;
		flex-direction: column;
	}

	.button {
		font-size: 2em;
	}

	.close {
		position: absolute;
		top: 0.1em;
		right: 0.1em;
		color: var(--secondary);
		width: fit-content;
		height: fit-content;
		background-color: transparent;
		border: none;
		font-size: 1.5em;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}
	.close:hover {
		font-size: 1.6em;
		color: var(--secondary-accent);
	}
</style>
