<template>
  <main class="container">
    <h1>Showing Guesses</h1>
    <!--This is a temporary test button-->
    <button @click="nextRound()">Next Round</button>
    <ShowingGuessesMap />
  </main>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { emitter } from "@/main";
import type {
  locationType,
  guessInfoType,
  gameInfoType,
} from "@/views/FortunaGuessrView.vue";

import ShowingGuessesMap from "./ShowingGuesses/ShowingGuessesMap.vue";

export default defineComponent({
  name: "ShowingGuesses",
  data: () => ({
    guessData: {} as guessInfoType,
  }),
  methods: {
    nextRound() {
      console.log("Next round");
      emitter.emit("NextRound");
    },
  },
  mounted() {
    emitter.on("Guess", (guessData: guessInfoType) => {
      this.guessData = guessData;
    });
  },
  components: { ShowingGuessesMap },
});
</script>
<style scoped></style>
