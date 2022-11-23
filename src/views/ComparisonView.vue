<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useComparisonStore } from "@/stores/comparison";

const store = useComparisonStore();
const { nextBallot, candidateOne, candidateTwo } = storeToRefs(store);
const { castVote } = store;

function selectOptionOne() {
  castVote(candidateOne.value, candidateTwo.value);
}
function selectOptionTwo() {
  castVote(candidateTwo.value, candidateOne.value);
}
</script>

<template>
  <div>
    <h1>Comparison</h1>
    <div v-if="nextBallot">
      <p>Pick the one you prefer.</p>
      <div>
        <button @click="selectOptionOne">{{ candidateOne }}</button>
        <button @click="selectOptionTwo">{{ candidateTwo }}</button>
      </div>
    </div>
    <div v-else>
      <p>Voting is complete.</p>
    </div>
  </div>
</template>
