<template>
	<div class="outer-container">
		<div>
			<h1>Guess</h1>
			<p>Points gained: <span id="points"></span>pts</p>
			<p>Distance to target: <span id="distance"></span></p>
		</div>
		<div id="multiShow">
			<MultiplayerShow />
		</div>
	</div>

	<div id="guessImgContainer">
		<button class="button" id="showImage" @click.prevent="showImage()">Show image</button>
		<div id="zoom" class="magnify-wrapper" style="visibility: hidden">
			<img id="guessImage" alt="Current image of the map" />
			<img id="large-img" />
		</div>
	</div>
</template>

<script lang="ts">
	import {GameIO, GameApp} from "../multiplayer";
	import {defineComponent} from "vue";
	import MultiplayerShow from "./MultiplayerGuess.vue";
	import {getImgNumber, getImageData} from "../gameFunctionality";

	export default defineComponent({
		name: "GameGuess",
		components: {
			MultiplayerShow
		},
		data: function () {
			return {
				showMultiPlayer: false,
				showSelector: true,
				enteredSeed: "",
				gameId: GameApp.App.gameId,
				name: GameApp.Player.myName,
				players: GameApp.players
			};
		},
		methods: {
			showImage: function () {
				if (document.getElementById("zoom")!.style.visibility == "hidden") {
					document.getElementById("showImage")!.innerHTML = "Hide Image";
					document.getElementById("zoom")!.style.visibility = "visible";
				} else {
					document.getElementById("showImage")!.innerHTML = "Show Image";
					document.getElementById("zoom")!.style.visibility = "hidden";
				}
			}
		},
		mounted() {
			if (GameApp.App.gameId == "0") {
				document.getElementById("multiShow")!.style.display = "none";
			} else {
				document.getElementById("multiShow")!.style.display = "auto";
			}

			//Image
			var imageSrc = getImageData()[getImgNumber()].src;
			var img = document.getElementById("guessImage") as HTMLImageElement;
			if (img) {
				img.src = imageSrc;
			}
			document.getElementById("showImage")!.innerHTML = "Show Image";
			//Magnifying glass
			//Zoom magnifying
			magnify(3);
			function magnify(zoom: number) {
				var glass = document.getElementById("large-img") as HTMLImageElement;
				var img = document.getElementById("guessImage") as HTMLImageElement;

				/* Set background properties for the magnifier glass: */
				glass.style.backgroundImage = "url('" + img.src + "')";
				glass.style.backgroundRepeat = "no-repeat";
				glass.style.backgroundSize = img.width * zoom + "px " + img.height * zoom + "px";
				var bw = 3;
				/* Execute a function when someone moves the magnifier glass over the image: */
				glass.addEventListener("mousemove", moveMagnifier);
				img.addEventListener("mousemove", moveMagnifier);

				/*and also for touch screens:*/
				glass.addEventListener("touchmove", moveMagnifier);
				img.addEventListener("touchmove", moveMagnifier);
				function moveMagnifier(e: MouseEvent | TouchEvent) {
					if (img.src.includes("TimeIsUp")) {
						glass.style.display = "none";
						return;
					}
					glass.style.display = "auto";
					var w = glass.width / 2;
					var h = glass.width / 2;
					var pos, x, y;
					/* Prevent any other actions that may occur when moving over the image */
					e.preventDefault();
					/* Get the cursor's x and y positions: */
					pos = getCursorPos(e);
					x = pos.x;
					y = pos.y;
					/* Prevent the magnifier glass from being positioned outside the image: */
					if (x > img.width - w / zoom) {
						x = img.width - w / zoom;
					}
					if (x < w / zoom) {
						x = w / zoom;
					}
					if (y > img.height - h / zoom) {
						y = img.height - h / zoom;
					}
					if (y < h / zoom) {
						y = h / zoom;
					}
					/* Set the position of the magnifier glass: */
					glass.style.left = x - w + "px";
					glass.style.top = y - h + "px";
					/* Display what the magnifier glass "sees": */
					glass.style.backgroundPosition = "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
					glass.style.backgroundImage = "url('" + img.src + "')";
					glass.style.backgroundRepeat = "no-repeat";
					glass.style.backgroundSize = img.width * zoom + "px " + img.height * zoom + "px";
				}

				function getCursorPos(e: MouseEvent | TouchEvent) {
					var a,
						x = 0,
						y = 0;
					e = e || window.event;
					/* Get the x and y positions of the image: */
					a = img.getBoundingClientRect();
					if (e instanceof TouchEvent) {
						x = e.touches[0].clientX - a.left;
						y = e.touches[0].clientY - a.top;
					} else {
						/* Calculate the cursor's x and y coordinates, relative to the image: */
						x = e.pageX - a.left;
						y = e.pageY - a.top;
					}
					/* Consider any page scrolling: */
					x = x - window.pageXOffset;
					y = y - window.pageYOffset;
					return {x: x, y: y};
				}
			}
		}
	});
</script>

<style scoped>
	main {
		position: relative;
		width: 100%;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}
	#guessImgContainer {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 2em;
	}
	.magnify-wrapper {
		position: relative;
		max-height: 50vh;
	}
	.magnify-wrapper img {
		max-height: inherit;
	}
	#large-img {
		background: no-repeat transparent;
		width: 30%;
		height: 0;
		padding-bottom: 29.5%;
		pointer-events: none;
		position: absolute;
		border: 0.2em solid #efefef;
		z-index: 100;
		border-radius: 100%;
		display: block;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.magnify-wrapper:hover {
		cursor: none;
	}
	.magnify-wrapper:hover #large-img,
	.magnify-wrapper:active #large-img {
		opacity: 1;
	}
	#guessImage {
		width: 100%;
		border: 0.2vh solid var(--primary-accent);
		clip-path: polygon(4% 0%, 100% 0, 100% 92%, 96% 100%, 0 100%, 0% 8%);
	}

	#zoom {
		width: 75%;
		max-height: 50%;
		margin-top: 1vh;
	}

	.multiShow {
		display: none;
	}

	.outer-container {
		border: 2px solid var(--primary-accent);
		padding: 2em;
	}

	.outer-container div {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
</style>
