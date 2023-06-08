<template>
	<Transition name="scale-in" appear>
		<section class="container">
			<div class="title-container">
				<h2>Lobby</h2>
				<p class="subtitle">
					<span class="current-player-amount"> {{ playerList.length }} / 10 </span> players
				</p>
				<ul>
					<li v-for="player in playerList">
						<p>{{ player.name }}</p>
						<button @click="kickPlayer(player)" class="small-button leave" v-if="showControls && playerList.length > 1 && player.socketId != getMySocketId()">Kick</button>
					</li>
				</ul>
			</div>
		</section>
	</Transition>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {app, emitter, toast} from "@/main";

	import {GameApp} from "../../multiplayer";
	import {App} from "@/multiplayer";
	import type {PlayerDataType} from "@/multiplayer";

	export default defineComponent({
		name: "PlayerList",
		data: () => ({
			playerList: [] as PlayerDataType[],
			showControls: App.host
		}),
		mounted() {
			emitter.on("PlayerListUpdated", (players: PlayerDataType[]) => {
				if (GameApp.state != "Start") return;
				this.playerList = players;
			});
			this.playerList = App.playerList ?? [];

			emitter.on("HostChanged", () => {
				if (GameApp.state != "Start") return;
				this.showControls = App.host;
				console.log(App.host);
			});
		},
		methods: {
			getMySocketId() {
				return App.myPlayerData.socketId;
			},
			kickPlayer(player: PlayerDataType) {
				App.KickPlayer(player.socketId);
			}
		}
	});
</script>

<style scoped lang="less">
	@import url("@/assets/text-input.css");

	.container {
		border: 1px solid var(--border-color-base);
		padding: var(--space-lg);

		background-color: var(--color-surface-3);
		border-radius: 2rem;
		box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

		transition: border-color 0.2s ease;
		&:hover {
			border-color: var(--border-color-input--hover);
		}
		& h2 {
			text-align: center;
		}
	}

	.subtitle {
		text-align: center;
		font-size: 0.8rem;
		margin-bottom: var(--space-sm);
	}

	.roomID {
		color: var(--color-base--subtle);
		background-color: var(--color-surface-0);
		border: 1px solid var(--border-color-base);
		border-radius: 3px;
		padding: var(--space-xs);
		cursor: copy;
		font-family: monospace;
	}

	.current-player-amount {
		color: var(--color-base--subtle);
	}

	.button-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		gap: var(--space-sm);

		button {
			margin: 0;
			width: 100%;
		}
	}

	.join {
		background-color: var(--color-success);
	}

	.leave {
		background-color: var(--color-destructive);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	li {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: var(--space-md);
	}

	li p {
		display: flex;
		align-items: center;
	}

	svg {
		fill: var(--color-base);
	}

	.show-streamer-mode {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding-left: var(--space-xs);
		translate: 0 3px;
		cursor: pointer;
	}
</style>
