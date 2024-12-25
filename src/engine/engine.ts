import { roundTo } from "../helpers/utils";

export class EloRatingCalculator {
  private K: number;
  private KnockoutMultiplier: number
  private InitialRating: number
  private RatingType: string

  constructor(K: number = 20, KnockoutMultiplier: number = 1.2, InitialRating: number = 1000, RatingType: string = "normal") {
    this.K = K;
    this.KnockoutMultiplier = KnockoutMultiplier;
    this.InitialRating = InitialRating;
    this.RatingType = RatingType;
  }

  private calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return roundTo(1 / (1 + 10 ** ((opponentRating - playerRating) / 400)), 4);
  }

  public calculateRatingDelta(playerRating: number, opponentRating: number, isKO: boolean = false, realScore: number = 1): number {
    const expectedScore = this.calculateExpectedScore(playerRating, opponentRating);
    const delta = roundTo(this.K * (realScore - expectedScore), 2);
    if(isKO) {
      return delta * this.KnockoutMultiplier;
    }
    return delta;
  }

  public getKFactor(): number {
    return this.K;
  }
  
  public getKnockoutMultiplier(): number {
    return this.KnockoutMultiplier;
  }
  
  public getInitialRating(): number {
    return this.InitialRating;
  }
  
  public getRatingType(): string {
    return this.RatingType;
  }
}