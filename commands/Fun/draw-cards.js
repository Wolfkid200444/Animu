const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['drawcards'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Draw a hand of playing cards',
      usage: '<cardsAmount:int{1,10}> [includeJokers:boolean]',
      usageDelim: ' ',
    });
    this.suits = ['♣', '♥', '♦', '♠'];
    this.faces = ['Jack', 'Queen', 'King'];
    this.deck = null;
  }

  async run(msg, [cardsAmount, includeJokers = false]) {
    if (!this.deck) this.deck = this.generateDeck();
    let cards = this.deck;
    if (!includeJokers) cards = cards.filter((card) => !card.includes('Joker'));
    return msg.send(
      new MessageEmbed({
        title: 'Cards Drawn',
        description: _.shuffle(cards)
          .slice(0, cardsAmount)
          .join('\n'),
        color: 0x2196f3,
      }),
    );
  }

  generateDeck() {
    const deck = [];
    for (const suit of this.suits) {
      deck.push(`${suit} Ace`);
      for (let i = 2; i <= 10; i++) deck.push(`${suit} ${i}`);
      for (const face of this.faces) deck.push(`${suit} ${face}`);
    }
    deck.push('⭐ Joker');
    deck.push('⭐ Joker');
    return deck;
  }
***REMOVED***
