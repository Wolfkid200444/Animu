const { Command } = require('klasa');
const { formatNumber } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['scrabble'],
      cooldown: 10,
      description: 'Determine scrable score of a word',
      usage: '<word:string>',
    });
  }

  async run(msg, [word]) {
    word = word.toLowerCase();
    let score = 0;
    for (const letter of word.split('')) {
      if (!letters[letter]) continue;
      score += letters[letter];
    }
    return msg.reply(formatNumber(score));
  }
***REMOVED***

// Letters
const letters = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
***REMOVED***
