<template>
	<div class="home">
		<!-- <div class="logo">
            <img class="logoImg" src="/wiki_logo_bar.png" />
        </div> -->
		<div class="about">
			<div>
				<h3>The Cycle: Frontier Wiki:</h3>
				<p>The Cycle: Frontier Wiki brings you the player up to date information for The Cycle: Frontier</p>
				<p>Get the most up to date information from the official Wiki</p>
				<p>Enhance your gaming experience with our websites and tools</p>
				<p>All for free without any ads!</p>
			</div>
			<div>
				<img class="partnerImg" src="/home-images/Favored_Badge.png" />
			</div>
			<div>
				<h3>The Cycle: Frontier</h3>
				The Cycle: Frontier is a free-to-play high-stakes PvPvE first-person shooter driven by suspense and danger. Prospect for resources and other riches on an abandoned alien world ravaged by a deadly storm, inhabited by monsters, and frequently raided by other ambitious Prospectors.
			</div>
		</div>
		<div class="navigation">
			<h3>Navigation</h3>
			<div>
				<RouterLink v-for="route in $router.options.routes" :to="route.path" class="navlink centerd">
					<div class="router-link-content" v-tooltip.right="route.name">{{ route.name }}</div>
				</RouterLink>
			</div>
		</div>
		<div class="contributors">
			<h3>Our Contributors</h3>
			<div class="contrib-container">
				<div class="contrib-item">
					<img src="/home-images/frog_avatar.png" />
					<h4>VeryGreatFrog</h4>
					<ul>
						<li>Wiki Lead</li>
						<li>Social Media</li>
						<li>Interactive Map</li>
						<li>Weapon Calculator</li>
						<li>Forge Simulator</li>
						<li>Progress Tracker</li>
						<li>Fortuna Guessr</li>
					</ul>
				</div>
				<div class="contrib-item">
					<img src="/home-images/contributor_avatar.png" />
					<h4>Wiki Contributors</h4>
					<ul>
						<li>Wiki Contributions</li>
						<li>Bug Reports</li>
						<li>Feature Requests</li>
						<li>Massive thanks to all of you!</li>
					</ul>
				</div>
				<div class="contrib-item">
					<img src="/home-images/stevn_avatar.png" />
					<h4>Stevnbak</h4>
					<ul>
						<li>Wiki Lead</li>
						<li>Data compiling</li>
						<li>Interactive Map</li>
						<li>Weapon Calculator</li>
						<li>Forge Simulator</li>
						<li>Loadout Generator</li>
						<li>Fortuna Guessr</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView} from "vue-router";
</script>

<style scoped lang="less">
/* Main */
.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: calc(99vw - 2.8 * var(--padding-page));
	height: 100%;

	@media screen and (max-width: 900px) {
		width: 100vw;
	}
}

h3 {
	font-size: 2em;
	margin-bottom: 1em;
	font-weight: 700;
}
/* Logo */
.logo {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 75%;
}
.logoImg {
	width: 60%;
	height: auto;
}

/* About */
.about {
	width: 100%;
	text-align: center;
	display: flex;
	vertical-align: middle;
	padding: 0 var(--space-md) 0 var(--space-md);
	margin: var(--space-xl) 0 2em 0;
}

.about div {
	width: 33%;
	margin: 0em var(--space-xl) 0em var(--space-xl);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.partnerImg {
	width: 60%;
	height: auto;
}

/* Navigation */
.navigation {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: var(--space-xl) 0;
}
.navigation div {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: var(--space-md);
}
.navigation a {
	text-align: center;
}

.navigation img {
	width: 100%;
	height: auto;
}

/* CONTRIBUTORS */
.contributors {
	width: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: var(--space-xl) 0 var(--space-xl) 0;
}
.contrib-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: var(--space-xl);
}
.contrib-item {
	width: 20%;
	padding: 0 var(--space-md) 0 var(--space-md);
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
}
.contrib-item h4 {
	width: 100%;
	text-align: center;
	font-size: 1.5em;
	font-weight: 600;
	margin: var(--space-sm) 0 var(--space-sm) 0;
}
.contrib-item img {
	margin: 0;
	border-radius: 50%;
	border: 1px solid var(--border-color-base);
	height: 12em;
	width: 12em;
}
.contrib-item ul {
	padding: 0;
	width: 80%;
	list-style-type: none;
}

/* Vertical mode */
@media screen and (max-width: 900px) {
	.logoImg {
		width: 100%;
	}
	.about {
		width: 100%;
		flex-direction: column;
	}
	.about div {
		width: 100%;
		margin: 0em 0em var(--space-xl) 0em;
	}

	.navigation {
		width: 100%;
		flex-wrap: wrap;
	}
	.navigation div {
		width: 100%;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.navigation a {
		width: 23%;
		padding: 0 var(--space-sm) 0 var(--space-sm);
	}

	.contrib-container {
		margin: 0em var(--space-md) 0em var(--space-md);
		flex-direction: column;
		gap: var(--space-xl);
		width: 75%;
	}

	.contrib-item {
		width: 80%;
		margin: auto;
	}

	.contrib-item img {
		margin: auto auto var(--space-md) auto;
		border-radius: 50%;
		border: 1px solid var(--border-color-base);
		height: 6rem;
		width: 6rem;
	}
}
</style>
