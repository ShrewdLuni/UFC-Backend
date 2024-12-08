import { triggerAsyncId } from "async_hooks";
import { roundTo } from "../helpers/utils";

class EloRatingCalculator {
  private K: number;
  private KOMultiplier: number

  constructor(K: number = 20, KOMultiplier: number = 1.2) {
    this.K = K;
    this.KOMultiplier = KOMultiplier;
  }

  private calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return roundTo(1 / (1 + 10 ** ((opponentRating - playerRating) / 400)), 4);
  }

  public calculateRatingChange(playerRating: number, opponentRating: number, realScore: number, isKO: boolean = false): number {
    const expectedScore = this.calculateExpectedScore(playerRating, opponentRating);
    const delta = roundTo(this.K * (realScore - expectedScore), 2);
    if(isKO) {
      return delta * this.KOMultiplier;
    }
    return delta;
  }
}