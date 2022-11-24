<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useComparisonStore } from "@/stores/comparison";

const store = useComparisonStore();
const { results } = storeToRefs(store);
</script>

<template>
  <div>
    <h1>Results</h1>
    <ol v-if="results.length">
      <li v-for="candidate in results" :key="candidate">{{ candidate }}</li>
    </ol>
    <div v-else>
      <p>No results yet.</p>
    </div>
  </div>
</template>
