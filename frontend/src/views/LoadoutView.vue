<template>
	<Page />
</template>
<script lang="ts">
import {defineComponent} from "vue";
import Page from "@/games/loadout/PageLoadout.vue";

export default defineComponent({
	name: "LoadoutView",
	components: {Page}
});
</script>
