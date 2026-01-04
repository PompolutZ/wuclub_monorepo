/**
 * Test Data for Valid Deck Configurations
 * These card IDs are from the universal set and work for any faction
 */

/**
 * Valid objectives (12 cards: 6 Surge + 6 End phase)
 * Meets Nemesis format requirement of at least 12 objectives with max 6 Surge
 */
export const VALID_OBJECTIVES = [
  'Strike the Head',  // Surge
  'Branching Fate',  // Surge
  'Perfect Strike',  // Surge
  'Critical Effort',  // Surge
  'Get Stuck In',  // Surge
  'Strong Start',  // Surge
  "Keep Choppin'",  // End
  'Fields of Blood',  // End
  'Hold Treasure Token 1 or 2',  // End
  'Hold Treasure Token 3 or 4',  // End
  'Hold Treasure Token 5',  // End
  'Slow Advance'  // End
];

/**
 * Valid ploys (10 cards)
 * Universal ploy cards from BL set
 */
export const VALID_PLOYS = [
  'Determined Effort',
  'Twist the Knife',
  'Lure of Battle',
  'Sidestep',
  'Commanding Stride',
  'Illusory Fighter',
  'Wings of War',
  'Shields Up!',
  'Scream of Anger',
  'Healing Potion',
];

/**
 * Valid upgrades (10 cards)
 * Universal upgrade cards from BL set
 */
export const VALID_UPGRADES = [
  'Brawler',
  'Hidden Aid',
  'Accurate',
  'Great Strength',
  'Deadly Aim',
  'Sharpened Points',
  'Duellist',
  'Tough',
  'Great Fortitude',
  'Keen Eye',
];

/**
 * Complete valid deck configuration (32 cards total)
 * Meets all Nemesis format requirements:
 * - 32 total cards
 * - 12 objectives (6 Surge + 6 End)
 * - 20 power cards (10 ploys + 10 upgrades)
 */
export const VALID_DECK_CONFIG = {
  objectives: VALID_OBJECTIVES,
  ploys: VALID_PLOYS,
  upgrades: VALID_UPGRADES
};
