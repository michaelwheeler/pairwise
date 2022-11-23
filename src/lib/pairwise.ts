import _ from "lodash";

export type Vote = [string, string];

/**
 * Compares two votes to see if they have the same candidates.
 *
 * @param a - The first vote
 * @param b - The second vote to be compaired
 * @returns True if both votes have the same candidates
 */
export function pairsEqual(a: Vote, b: Vote): boolean {
  const [b1, b2] = b;
  return a.includes(b1) && a.includes(b2);
}

/**
 * Generates a list of all possible pairs from a list of candidates.
 *
 * @param candidates - The list of candidates
 * @param pairs - Previously determined pairs
 * @returns A list of all possible ballots
 */
export function possiblePairs(
  candidates: string[],
  pairs: Vote[] = []
): Vote[] {
  const first = _.head(candidates);
  if (!first || candidates.length < 2) {
    return pairs;
  }
  if (candidates.length === 2) {
    pairs.push(candidates as Vote);
    return pairs;
  }
  const remainder = _.tail(candidates);
  const newPairs = pairs.concat(
    remainder.map((candidate) => [first, candidate])
  );

  return possiblePairs(remainder, newPairs);
}

/**
 * Filters out all but the most recent vote for each pair.
 *
 * @param allVotes - A list of votes
 * @returns A list of the most recent votes for each pair
 */
export function latestVotes(allVotes: Vote[]) {
  allVotes = _.clone(allVotes).reverse();
  return _.uniqWith(allVotes, pairsEqual).reverse();
}

/**
 * Finds ballots that have not been compared.
 *
 * @param candidates - A list of candidates
 * @param allVotes - A list of existing votes
 * @returns Remaining ballots to be voted on
 */
export function remainingPairs(candidates: string[], allVotes: Vote[]) {
  const needed = possiblePairs(candidates);
  return _.differenceWith(needed, allVotes, pairsEqual);
}

/**
 * Counts how many votes a candidate has won.
 *
 * @param candidate - The name of the candidate
 * @param allVotes - All votes cast
 * @returns The number of matchups won by the specified candidate
 */
export function pointsEarned(candidate: string, allVotes: Vote[]) {
  const votes = latestVotes(allVotes);
  const winners = votes.map((v) => v[0]);
  return winners.filter((winner) => winner === candidate).length;
}

/**
 * Counts how many votes a candidate has won or lost.
 *
 * @param candidate - The name of the candidate
 * @param allVotes - All votes cast
 * @returns The number of matchups participated in by the specified candidate
 */
export function pointsOffered(candidate: string, allVotes: Vote[]) {
  const votes = latestVotes(allVotes);
  const participants = _.flatten(votes);
  return participants.filter((participant) => participant === candidate).length;
}

/**
 * Updates a list of votes with a newly cast vote. Implied wins and losses will be
 * included in the updated list.
 *
 * @param ballot - The new vote that has been cast
 * @param votes - An existing set of votes to update
 * @returns An updated list of votes
 */
export function updateVotes(ballot: Vote, votes: Vote[]) {
  const [winner, loser] = ballot;
  const impliedWins: Vote[] = votes
    .filter((v) => v[1] === winner)
    .map((v) => [v[0], loser]);
  const impliedLosses: Vote[] = votes
    .filter((v) => v[0] === loser)
    .map((v) => [winner, v[1]]);
  return _.uniqWith(
    votes.concat([ballot], impliedWins, impliedLosses),
    pairsEqual
  );
}

/**
 * Calculates the minimum number of new votes that will be created if a ballot is cast.
 *
 * @param ballot - The ballot to be tested
 * @param votes - A list of previously recorded votes
 * @returns The minimum number of new votes that will be created for a new ballot
 */
export function minNewVotes(ballot: Vote, votes: Vote[]) {
  const [a, b] = ballot;
  return Math.min(
    updateVotes(ballot, votes).length,
    updateVotes([b, a], votes).length
  );
}

/**
 * Calculates the maximum number of new votes that will be created if a ballot is cast.
 *
 * @param ballot - The ballot to be tested
 * @param votes - A list of previously recorded votes
 * @returns The maximum number of new votes that will be created for a new ballot
 */
export function maxNewVotes(ballot: Vote, votes: Vote[]) {
  const [a, b] = ballot;
  return Math.max(
    updateVotes([a, b], votes).length,
    updateVotes([b, a], votes).length
  );
}

/**
 * Suggests the ballot to be voted on next, based on how many implied votes it will
 * result in.
 *
 * @param candidates - The list of candidates
 * @param votes - Previously recorded votes
 * @returns The suggested next ballot
 */
export function nextBallot(candidates: string[], votes: Vote[]) {
  const remaining = remainingPairs(candidates, votes);
  if (!remaining) {
    return null;
  }
  const minVotes = _.curryRight(minNewVotes)(votes);
  const maxVotes = _.curryRight(maxNewVotes)(votes);
  const options = _.sortBy(remaining, [minVotes, maxVotes]);
  return _.takeRight(options)[0];
}

/**
 * Tallies the number of wins for the specified candidate.
 *
 * @param votes - A list of votes
 * @param candidate - The candidate to tally wins for
 * @returns The number of wins for the specified candidate
 */
export function getWins(votes: Vote[], candidate: string) {
  return votes.map((vote) => vote[0]).filter((name) => name === candidate)
    .length;
}

/**
 * Ranks a list of candidates based on wins.
 *
 * @param candidates - The list of candidates to be ranked
 * @param votes - The votes upon which to base the ranking
 * @returns A ranked list of candidates
 */
export function getRanking(candidates: string[], votes: Vote[]) {
  const ranking = _.sortBy(
    [...candidates],
    [_.curry(getWins)(votes)]
  ).reverse();
  return ranking;
}
