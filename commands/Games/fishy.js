const { Command } = require('klasa');
const { randomRange } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['fishing'],
      cooldown: 10,
      description: 'Go fishing',
    });
  }

  async run(msg) {
    const fishID = Math.floor(Math.random() * 10) + 1;
    let rarity;
    if (fishID < 5) rarity = 'junk';
    else if (fishID < 8) rarity = 'common';
    else if (fishID < 10) rarity = 'uncommon';
    else rarity = 'rare';
    const fish = fishes[rarity];
    const worth = randomRange(fish.min, fish.max);
    return msg.reply(
      `You caught a ${fish.symbol}. I bet it'd sell for around $${worth}.`,
    );
  }
***REMOVED***

// Fishes
const fishes = {
  junk: {
    symbol: '🔧',
    max: 2,
    min: 1,
  },
  common: {
    symbol: '🐟',
    max: 5,
    min: 2,
  },
  uncommon: {
    symbol: '🐠',
    max: 10,
    min: 5,
  },
  rare: {
    symbol: '🐡',
    max: 20,
    min: 10,
  },
***REMOVED***
