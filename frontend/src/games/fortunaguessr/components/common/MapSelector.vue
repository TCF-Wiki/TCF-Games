<template>
    <div class="map-selector">
        <button class="button" type="button" @click="requestMap(1)"> Map 1</button>
        <button class="button" type="button" @click="requestMap(2)"> Map 2</button>
        <button class="button" type="button" @click="requestMap(3)"> Map 3</button>
    </div>
{{ state }}
</template>

<script lang="ts">
import {defineComponent} from "vue";
// @ts-ignore
import { emitter } from "@/main"
export default defineComponent({
    props: ["state"],
    emits: ['changeMap'],
    methods: {
        requestMap(mapNumber: number) {
            if (this.state == "game") emitter.emit('changeMapGame', mapNumber)
            if (this.state == "showguess") emitter.emit('changeMapShowGuess', mapNumber)
            if (this.state == "end")  emitter.emit('changeMapEnd', mapNumber)
        }
    }
})
</script>

<style scoped lang="less">
</style>