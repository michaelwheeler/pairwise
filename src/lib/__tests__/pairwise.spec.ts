import { describe, it, expect } from "vitest";
import type { Vote } from "@/lib/pairwise";
import * as pairwise from "@/lib/pairwise";

describe("pairwise", () => {
  describe("pairsEqual", () => {
    it("should return true for equal ballots", () => {
      const a: Vote = ["one", "two"];
      const b: Vote = ["one", "two"];
      expect(pairwise.pairsEqual(a, b)).toBe(true);
    });
    it("should return true for ballots with the same candidates", () => {
      const a: Vote = ["one", "two"];
      const b: Vote = ["two", "one"];
      expect(pairwise.pairsEqual(a, b)).toBe(true);
    });
    it("should return false for pairs with different candidates", () => {
      const a: Vote = ["one", "two"];
      const b: Vote = ["one", "too"];
      expect(pairwise.pairsEqual(a, b)).toBe(false);
    });
    it("should not mutate arguments", () => {
      const a: Vote = ["one", "two"];
      const b: Vote = ["two", "one"];
      pairwise.pairsEqual(a, b);
      expect(a).toEqual(["one", "two"]);
      expect(b).toEqual(["two", "one"]);
    });
  });

  describe("possiblePairs", () => {
    it("should return empty list for one candidate", () => {
      expect(pairwise.possiblePairs(["one"])).toHaveLength(0);
    });
    it("should return candidates for length two", () => {
      const candidates = ["one", "two"];
      expect(pairwise.possiblePairs(candidates)).toHaveLength(1);
    });
    it("should return all possible ballots", () => {
      const candidates = ["one", "two", "three", "four"];
      expect(pairwise.possiblePairs(candidates)).toHaveLength(6);
      const sixCandidates = ["one", "two", "three", "four", "five", "six"];
      expect(pairwise.possiblePairs(sixCandidates)).toHaveLength(15);
    });
    it("should not mutate the list of candidates", () => {
      const sixCandidates = ["one", "two", "three", "four", "five", "six"];
      pairwise.possiblePairs(sixCandidates);
      expect(sixCandidates).toHaveLength(6);
    });
  });

  describe("latestVotes", () => {
    it("should return the most recent results for each pair", () => {
      const all: Vote[] = [
        ["one", "three"], // oldest, should be removed
        ["one", "two"],
        ["three", "two"], // should be removed
        ["one", "three"],
        ["two", "three"], // newest vote
      ];
      const latest = [
        ["one", "two"], // oldest
        ["one", "three"],
        ["two", "three"], // newest vote
      ];
      expect(pairwise.latestVotes(all)).toEqual(latest);
    });
    it("should not mutate argument", () => {
      const all: Vote[] = [
        ["one", "three"],
        ["one", "two"],
        ["three", "two"],
        ["one", "three"],
        ["two", "three"],
      ];
      pairwise.latestVotes(all);
      expect(all).toEqual([
        ["one", "three"],
        ["one", "two"],
        ["three", "two"],
        ["one", "three"],
        ["two", "three"],
      ]);
    });
  });

  describe("remainingPairs", () => {
    it("should find missing votes", () => {
      const candidates = ["one", "two", "three", "four"];
      const votes: Vote[] = [
        ["one", "two"],
        ["one", "four"],
        ["two", "three"],
        ["three", "four"],
      ]; // missing one-three and two-four
      const remaining = pairwise.remainingPairs(candidates, votes);
      expect(remaining).toHaveLength(2);
      expect(remaining).toContainEqual(["one", "three"]);
      expect(remaining).toContainEqual(["two", "four"]);
    });
    it("should not mutate arguments", () => {
      const candidates = ["one", "two", "three"];
      const votes: Vote[] = [
        ["one", "two"],
        ["one", "three"],
      ];
      pairwise.remainingPairs(candidates, votes);
      expect(candidates).toEqual(["one", "two", "three"]);
      expect(votes).toEqual([
        ["one", "two"],
        ["one", "three"],
      ]);
    });
  });

  describe("pointsEarned", () => {
    it("should return one point for each winning vote", () => {
      const votes: Vote[] = [
        ["three", "two"],
        ["one", "two"],
        ["one", "three"],
        ["two", "three"],
      ];
      expect(pairwise.pointsEarned("one", votes)).toBe(2);
      expect(pairwise.pointsEarned("two", votes)).toBe(1);
      expect(pairwise.pointsEarned("three", votes)).toBe(0);
    });
  });

  describe("pointsOffered", () => {
    it("should return one point for each participant", () => {
      const votes: Vote[] = [
        ["three", "two"],
        ["one", "two"],
        ["one", "three"],
        ["two", "three"],
        ["four", "three"],
      ];
      expect(pairwise.pointsOffered("one", votes)).toBe(2);
      expect(pairwise.pointsOffered("two", votes)).toBe(2);
      expect(pairwise.pointsOffered("three", votes)).toBe(3);
      expect(pairwise.pointsOffered("four", votes)).toBe(1);
    });
  });

  describe("updateVotes", () => {
    it("should update votes", () => {
      const vote: Vote = ["2", "3"];
      const oldVotes: Vote[] = [
        ["1", "2"],
        ["3", "4"],
      ];
      expect(pairwise.updateVotes(vote, oldVotes)).toEqual([
        ["1", "2"],
        ["3", "4"],
        ["2", "3"],
        ["1", "3"],
        ["2", "4"],
      ]);
    });
  });

  describe("minNewVotes", () => {
    it("should return the minimum number of votes created by a new ballot", () => {
      const votes: Vote[] = [
        ["1", "2"],
        ["3", "4"],
        ["1", "4"],
      ];
      const ballotA: Vote = ["2", "3"];
      expect(pairwise.minNewVotes(ballotA, votes)).toBe(4);
    });
  });

  describe("nextBallot", () => {
    it("should select the best ballot", () => {
      const oldVotes: Vote[] = [
        ["1", "2"],
        ["3", "4"],
      ];
      const next = pairwise.nextBallot(["1", "2", "3", "4"], oldVotes);
      expect(next).toEqual(["2", "4"]);
    });
  });

  describe("getRanking", () => {
    it("should return the correct ranking", () => {
      const candidates = ["2", "1", "4", "3"];
      const votes: Vote[] = [
        ["2", "3"],
        ["1", "2"],
        ["1", "4"],
        ["2", "4"],
        ["1", "3"],
        ["3", "4"],
      ];
      const ranking = pairwise.getRanking(candidates, votes);
      expect(ranking).toEqual(["1", "2", "3", "4"]);
    });
  });
});
