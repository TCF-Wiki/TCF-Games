<template>
	<div class="container">
		<progress :value="timeLeft" min="0" :max="maxTimer" id="progressBar"></progress>
	</div>
	<div>
		<div id="zoom" class="magnify-wrapper">
			<img alt="Current image of the map" id="locationImg" src="" />
			<img id="large-img" />
		</div>
		<img id="loadImg" />
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";
	import {getTime} from "../main";
	import {getCurrentTime} from "../gameFunctionality";

	export default defineComponent({
		data: function () {
			return {
				timeLeft: getTime()
			};
		},
		computed: {
			maxTimer(): number {
				return getTime();
			}
		},
		mounted() {
			//Update progress bar
			this.timeLeft = getTime() - getCurrentTime();
			setInterval(() => {
				this.timeLeft = getTime() - getCurrentTime();
				if (this.timeLeft <= 0) this.timeLeft = 0;
			}, 10);

			//Zoom magnifying
			magnify(3);
			function magnify(zoom: number) {
				var glass = document.getElementById("large-img") as HTMLImageElement;
				var img = document.getElementById("locationImg") as HTMLImageElement;

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
	#locationImg {
		width: 100%;
		border: 0.2vh solid var(--primary-accent);
		clip-path: polygon(4% 0%, 100% 0, 100% 92%, 96% 100%, 0 100%, 0% 8%);
	}
	#loadImg {
		visibility: hidden;
		height: 0;
		width: 0;
	}

	.container {
		position: fixed;
		top: -10px;
		left: 0;
		padding: 0;
		z-index: 999;
	}
	.container progress {
		background-color: var(--primary-accent);
		height: 12px;
		width: 100vw;
		border: 0;
		margin: 0;
		padding: 0;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	.container progress::-webkit-progress-bar {
		background-color: var(--primary-accent);
	}
	.container progress::-webkit-progress-value {
		background: var(--tertairy-accent);
	}
	.container progress::-moz-progress-bar {
		background: var(--tertairy-accent);
		width: 102%;
	}

	.container progress:not([value]) {
		display: none;
	}
</style>
