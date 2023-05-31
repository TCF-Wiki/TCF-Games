<template>
	<div>
		<h2>Room Id</h2>
		<p>
			Toggles if the room ID is visible <br />
			during the waiting screen
		</p>
		<form>
			<div class="toggle-pill-color">
				<input id="roomDisplayCheckbox" type="checkbox" @change.prevent="storeCookie()" />
				<label for="roomDisplayCheckbox"> </label>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
	import {defineComponent} from "vue";

	export default defineComponent({
		name: "TheUnitSelector",
		methods: {
			storeCookie: function (): void {
				if (!window.localStorage.getItem("displayRoomId")) {
					window.localStorage.setItem("displayRoomId", "true");
				} else {
					let oldValue = window.localStorage.getItem("displayRoomId");
					if (oldValue == "true") {
						window.localStorage.setItem("displayRoomId", "false");
					} else {
						window.localStorage.setItem("displayRoomId", "true");
					}
					//console.log(oldValue, window.localStorage.getItem('displayRoomId'))
				}
			},
			checkIfChecked: function (): boolean {
				let currentValue = window.localStorage.getItem("displayRoomId");
				//console.log(currentValue)
				if (currentValue == "true") {
					return true;
				} else {
					return false;
				}
			}
		},
		mounted() {
			if (!window.localStorage.getItem("displayRoomId")) {
				window.localStorage.setItem("displayRoomId", "true");
			}
			let selector = document.getElementById("roomDisplayCheckbox") as HTMLInputElement;
			selector.checked = this.checkIfChecked();
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
</style>
