<template>
	<div>
		<h2>Units</h2>
		<p>
			Sets which unit to use <br />
			when displaying distance
		</p>
		<form>
			<label for="metricSystem" class="l-radio">
				<input id="metricSystem" type="radio" name="unit selector" @change="storeCookie('metric')" :checked="getCookie('metric')" />
				<span> Metric </span>
			</label>
			<label for="imperialSystem" class="l-radio">
				<input id="imperialSystem" type="radio" name="unit selector" @change="storeCookie('imperial')" :checked="getCookie('imperial')" />
				<span> Imperial </span>
			</label>
		</form>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";

	export default defineComponent({
		name: "TheUnitSelector",
		methods: {
			storeCookie: function (type: string): void {
				if (!localStorage.getItem("preferredUnit")) {
					localStorage.setItem("preferredUnit", "metric");
				} else {
					localStorage.setItem("preferredUnit", type);
				}
			},
			getCookie: function (type: string | "metric" | "imperial"): boolean {
				let selected = localStorage.getItem("preferredUnit");
				if (type == "metric") {
					return selected == "metric" ? true : false;
				} else if (type == "imperial") {
					return selected == "imperial" ? true : false;
				}
				return false;
			}
		},
		mounted() {
			if (!localStorage.getItem("preferredUnit")) {
				localStorage.setItem("preferredUnit", "metric");
				const el = document.getElementById("metricSystem") as HTMLInputElement;
				el.checked = true;
			}
		}
	});
</script>

<style scoped>
	* {
		font-family: "Oxonium", sans-serif;
	}

	h2 {
		font-size: clamp(1.25em, 2.5vw, 1.5em);
		font-family: "Nulshock", sans-serif;
		margin-bottom: 0.1em;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	.l-radio {
		padding: 6px;
		border-radius: 50px;
		display: inline-flex;
		cursor: pointer;
		transition: background 0.2s ease;
		margin: 0.2em 0;
		-webkit-tap-highlight-color: transparent;
	}
	.l-radio:hover,
	.l-radio:focus-within {
		background: var(--primary-accent);
	}
	.l-radio input {
		vertical-align: middle;
		width: 1.6em;
		height: 1.6em;
		border-radius: 10em;
		background: none;
		border: 0;
		box-shadow: inset 0 0 0 1px var(--tertairy-accent);
		box-shadow: inset 0 0 0 1.5px var(--tertairy-accent);
		appearance: none;
		padding: 0;
		margin: 0;
		transition: box-shadow 150ms cubic-bezier(0.95, 0.15, 0.5, 1.25);
	}
	.l-radio input:focus {
		outline: none;
	}
	.l-radio input:checked {
		box-shadow: inset 0 0 0 6px var(--tertairy-accent);
	}
	.l-radio span {
		vertical-align: middle;
		display: inline-block;
		line-height: 20px;
		padding: 0 8px;
	}
</style>
