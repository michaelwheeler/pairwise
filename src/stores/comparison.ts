import { defineStore } from "pinia";
import type { Vote } from "@/lib/pairwise";

interface State {
  candidates: string[];
  votes: Vote[];
}

export const useComparisonStore = defineStore("comparison", {
  state: (): State => ({
    candidates: [],
    votes: [],
  }),
  actions: {
    addCandidate(candidate: string) {
      this.candidates.push(candidate);
    },
  },
});
