<template>
	<h2>Share this game!</h2>
	<div class="container">
		<a target="_blank" :href="twitterUrl"> <font-awesome-icon icon="fa-brands fa-twitter" /> </a>
		<font-awesome-icon icon="fa-brands fa-facebook" />
		<font-awesome-icon icon="fa-brands fa-discord" />
		<font-awesome-icon icon="fa-brands fa-instagram" />
	</div>
</template>
<script lang="ts">
	import {getGameInformation} from "../gameFunctionality";
	import {defineComponent} from "vue";

	export default defineComponent({
		data: function () {
			return {
				twitterUrl: ""
			};
		},
		methods: {
			createTwitterLink: function () {
				let gameInfo = getGameInformation();
				let score = gameInfo.score;
				let total = gameInfo.length * 5000;
				let difficulty = gameInfo.difficulty == 1 ? "Easy" : gameInfo.difficulty == 2 ? "Medium" : gameInfo.difficulty == 3 ? "Hard" : gameInfo.difficulty == 4 ? "Insane" : 0;
				return `https://twitter.com/intent/tweet?url=https%3A%2F%2Ffortunaguessr.com&via=TCFWiki&text=I%20just%20scored%20${score}%20points%20out%20of%20${total}%20on%20${difficulty}%20difficulty%20on%20the%20Fortuna%20Guessr%21&hashtags=thecyclefrontier%2Cfortunaguessr`;
			}
		},
		mounted() {
			this.twitterUrl = this.createTwitterLink();
		}
	});
</script>
<style scoped>
	svg {
		width: 4em;
		height: 4em;
		cursor: pointer;
	}

	.container {
		display: flex;
		justify-content: center;
		gap: 2em;
	}
</style>
