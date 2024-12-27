import { EloRatingCalculator } from '../engine/engine';

describe('EloRatingCalculator', () => {
  let engine: EloRatingCalculator;

  beforeEach(() => {
    engine = new EloRatingCalculator();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(engine.getKFactor()).toBe(20);
      expect(engine.getKnockoutMultiplier()).toBe(1.2);
      expect(engine.getInitialRating()).toBe(1000);
      expect(engine.getRatingType()).toBe('normal');
    });

    it('should allow custom initialization values', () => {
      const customEloCalculator = new EloRatingCalculator(30, 1.5, 1200, 'custom');
      expect(customEloCalculator.getKFactor()).toBe(30);
      expect(customEloCalculator.getKnockoutMultiplier()).toBe(1.5);
      expect(customEloCalculator.getInitialRating()).toBe(1200);
      expect(customEloCalculator.getRatingType()).toBe('custom');
    });
  });

  describe('calculateExpectedScore', () => {
    it('should calculate the correct expected score', () => {
      const playerRating = 1500;
      const opponentRating = 1600;
      const expectedScore = 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
      const calculatedScore = engine['calculateExpectedScore'](playerRating, opponentRating);
      expect(calculatedScore).toBeCloseTo(expectedScore, 4);
    });
  });

  describe('calculateRatingDelta', () => {
    it('should calculate the correct rating delta for a normal game', () => {
      const playerRating = 1500;
      const opponentRating = 1600;
      const realScore = 1;
      const expectedScore = engine['calculateExpectedScore'](playerRating, opponentRating);
      const expectedDelta = engine.getKFactor() * (realScore - expectedScore);
      const calculatedDelta = engine.calculateRatingDelta(playerRating, opponentRating, false, realScore);
      expect(calculatedDelta).toBeCloseTo(expectedDelta, 2);
    });

    it('should apply the knockout multiplier if isKO is true', () => {
      const playerRating = 1500;
      const opponentRating = 1600;
      const realScore = 1;
      const expectedScore = engine['calculateExpectedScore'](playerRating, opponentRating);
      const expectedDelta = engine.getKFactor() * (realScore - expectedScore) * engine.getKnockoutMultiplier();
      const calculatedDelta = engine.calculateRatingDelta(playerRating, opponentRating, true, realScore);
      expect(calculatedDelta).toBeCloseTo(expectedDelta, 2);
    });

    it('should return a negative rating delta for a loss', () => {
      const playerRating = 1500;
      const opponentRating = 1600;
      const realScore = 0;
      const expectedScore = engine['calculateExpectedScore'](playerRating, opponentRating);
      const expectedDelta = engine.getKFactor() * (realScore - expectedScore);
      const calculatedDelta = engine.calculateRatingDelta(playerRating, opponentRating, false, realScore);
      expect(calculatedDelta).toBeCloseTo(expectedDelta, 2);
    });
  });

  describe('getter methods', () => {
    it('should return the correct K factor', () => {
      expect(engine.getKFactor()).toBe(20);
    });

    it('should return the correct knockout multiplier', () => {
      expect(engine.getKnockoutMultiplier()).toBe(1.2);
    });

    it('should return the correct initial rating', () => {
      expect(engine.getInitialRating()).toBe(1000);
    });

    it('should return the correct rating type', () => {
      expect(engine.getRatingType()).toBe('normal');
    });
  });
});
