const { Command } = require('klasa');
const { shuffle, verify } = require('../../util/util');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['cool'],
      cooldown: 10,
      description: 'Play a game of blackjack',
      usage: '[deckCount:int{1,8}]',
    });
    this.suits = ['♣', '♥', '♦', '♠'];
    this.faces = ['Jack', 'Queen', 'King'];
    this.gameState;
  }

  async run(msg, [deckCount = 1]) {
    const current = await redisClient.hexistsAsync(
      'active_games',
      msg.channel.id,
    );
    if (current) {
      const currentGame = await redisClient.hgetAsync(
        'active_games',
        msg.channel.id,
      );
      return msg.reply(
        `Please wait until the current game of \`${currentGame}\` is finished.`,
      );
    }

    try {
      this.gameState = this.generateDeck(deckCount);

      const dealerHand = [];
      this.draw(msg.channel, dealerHand);
      this.draw(msg.channel, dealerHand);
      const playerHand = [];
      this.draw(msg.channel, playerHand);
      this.draw(msg.channel, playerHand);
      const dealerInitialTotal = this.calculate(dealerHand);
      const playerInitialTotal = this.calculate(playerHand);
      if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
        await redisClient.hdelAsync('active_games', msg.channel.id);
        return msg.send(
          'Well, both of you just hit blackjack. Right away. Rigged.',
        );
      } else if (dealerInitialTotal === 21) {
        await redisClient.hdelAsync('active_games', msg.channel.id);
        return msg.send(
          'Ouch, the dealer hit blackjack right away! Try again!',
        );
      } else if (playerInitialTotal === 21) {
        await redisClient.hdelAsync('active_games', msg.channel.id);
        return msg.send('Wow, you hit blackjack right away! Lucky you!');
      }
      let playerTurn = true;
      let win = false;
      let reason;
      while (!win) {
        if (playerTurn) {
          await msg.send(
            `**First Dealer Card:** ${
              dealerHand[0].display
            }\n**You (${this.calculate(playerHand)}):** ${playerHand
              .map((card) => card.display)
              .join('\n')}\n_Hit?_`,
          );
          const hit = await verify(msg.channel, msg.author);
          if (hit) {
            const card = this.draw(msg.channel, playerHand);
            const total = this.calculate(playerHand);
            if (total > 21) {
              reason = `You drew ${card.display}, total of ${total}! Bust`;
              break;
            } else if (total === 21) {
              reason = `You drew ${card.display} and hit 21`;
              win = true;
            }
          } else {
            const dealerTotal = this.calculate(dealerHand);
            await msg.send(
              `Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`,
            );
            playerTurn = false;
          }
        } else {
          const inital = this.calculate(dealerHand);
          let card;
          if (inital < 17) card = this.draw(msg.channel, dealerHand);
          const total = this.calculate(dealerHand);
          if (total > 21) {
            reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
            win = true;
          } else if (total >= 17) {
            const playerTotal = this.calculate(playerHand);
            if (total === playerTotal) {
              reason = `${
                card ? `Dealer drew ${card.display}, making it ` : ''
              }${playerTotal}-${total}`;
              break;
            } else if (total > playerTotal) {
              reason = `${
                card ? `Dealer drew ${card.display}, making it ` : ''
              }${playerTotal}-**${total}**`;
              break;
            } else {
              reason = `${
                card ? `Dealer drew ${card.display}, making it ` : ''
              }**${playerTotal}**-${total}`;
              win = true;
            }
          } else {
            await msg.send(`Dealer drew ${card.display}, total of ${total}.`);
          }
        }
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      if (win) return msg.send(`${reason}! You won!`);
      return msg.send(`${reason}! Too bad.`);
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }

  generateDeck(deckCount) {
    const deck = [];
    for (let i = 0; i < deckCount; i++) {
      for (const suit of this.suits) {
        deck.push({
          value: 11,
          display: `${suit} Ace`,
        });
        for (let j = 2; j <= 10; j++) {
          deck.push({
            value: j,
            display: `${suit} ${j}`,
          });
        }
        for (const face of this.faces) {
          deck.push({
            value: 10,
            display: `${suit} ${face}`,
          });
        }
      }
    }
    return shuffle(deck);
  }

  draw(channel, hand) {
    const deck = this.gameState;
    const card = deck[0];
    deck.shift();
    hand.push(card);
    return card;
  }

  calculate(hand) {
    return hand
      .sort((a, b) => a.value - b.value)
      .reduce((a, b) => {
        let { value } = b;
        if (value === 11 && a + value > 21) value = 1;
        return a + value;
      }, 0);
  }
***REMOVED***
