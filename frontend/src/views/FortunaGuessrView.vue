<template>
	<div class="loader"></div>
	<header>
		<div class="top">
			<h1>Fortuna Guessr</h1>
		</div>
		<div class="bottom">
			<div id="info"></div>
		</div>
	</header>
	<page>
		<div id="all"></div>
		<div id="left" class="side"></div>
		<div id="right" class="side"></div>
	</page>
	<div id="buttons"></div>
	<div id="footer"></div>
</template>

<script lang="ts">
	import "@/games/fortunaguessr/main";

	export default {
		name: "FortunaGuessrView"
	};
</script>

<style scoped></style>
