<script setup lang="ts">
import { ref } from "vue";
import { useComparisonStore } from "@/stores/comparison";
const { candidates, addCandidate } = useComparisonStore();
const newCandidate = ref("");
function addNewCandidate() {
  addCandidate(newCandidate.value);
  newCandidate.value = "";
}
</script>

<template>
  <main>
    <input type="text" v-model="newCandidate" />
    <button @click="addNewCandidate">Add</button>

    <ul>
      <li v-for="candidate in candidates" :key="candidate">
        {{ candidate }}
      </li>
    </ul>
  </main>
</template>
