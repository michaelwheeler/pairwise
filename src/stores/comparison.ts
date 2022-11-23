import { defineStore } from "pinia";
import type { Vote } from "@/lib/pairwise";
import { nextBallot, updateVotes } from "@/lib/pairwise";

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
    castVote(winner: string, loser: string) {
      this.votes = updateVotes([winner, loser], this.votes);
    },
  },
  getters: {
    nextBallot(state) {
      return nextBallot(state.candidates, state.votes);
    },
    candidateOne(): string {
      return this.nextBallot ? this.nextBallot[0] : "";
    },
    candidateTwo(): string {
      return this.nextBallot ? this.nextBallot[1] : "";
    },
  },
});
