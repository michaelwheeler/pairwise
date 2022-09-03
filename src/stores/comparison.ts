import { defineStore } from "pinia";

type Vote = [string, string];

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
