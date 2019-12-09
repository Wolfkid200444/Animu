const { Command } = require('klasa');
const prompt = require('discordjs-prompter');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['box-choose', 'choose-box', 'higurashi'],
      cooldown: 10,
      description:
        'Do you believe that there are choices in life? Taken from Higurashi Chapter 4',
    });
    this.blue = new Set();
    this.red = new Set();
  }

  async run(msg) {
    const current = await redisClient.hexistsAsync(
      'active_games',
      msg.channel.id
    );
    if (current) {
      const currentGame = await redisClient.hgetAsync(
        'active_games',
        msg.channel.id
      );
      return msg.reply(
        `Please wait until the current game of \`${currentGame}\` is finished.`
      );
    }
    await redisClient.hsetAsync('active_games', msg.channel.id, this.name);

    try {
      let i = 0;
      let path = 'before';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const line = script[path][i];
        if (line.end) {
          await redisClient.hdelAsync('active_games', msg.channel.id);
          return msg.send(line.text);
        } else {
          await msg.send(
            typeof line === 'object'
              ? line.text
              : `
						${line}
						_Proceed?_
					`
          );
        }
        if (line.options) {
          const filter = res =>
            res.author.id === msg.author.id &&
            line.options.includes(res.content.toLowerCase());
          const choose = await msg.channel.awaitMessages(filter, {
            max: 1,
            time: 120000,
          });
          if (!choose.size) break;
          path = '';
          const pick =
            line.paths[
              line.options.indexOf(choose.first().content.toLowerCase())
            ];
          if (
            (this.red.has(msg.author.id) && pick !== 'red') ||
            (this.blue.has(msg.author.id) && pick !== 'blue')
          ) {
            path += 'both';
            if (this.red.has(msg.author.id)) this.red.delete(msg.author.id);
            if (this.blue.has(msg.author.id)) this.blue.delete(msg.author.id);
          } else {
            this[pick].add(msg.author.id);
            setTimeout(() => {
              if (this[pick].has(msg.author.id))
                this[pick].delete(msg.author.id);
            }, 600000);
          }
          path += pick;
          i = 0;
        } else {
          const verification =
            (await prompt.reaction(msg.channel, {
              question: `${msg.author}, Proceed?`,
              userId: msg.author.id,
              timeout: 30000,
            })) === 'yes'
              ? true
              : false;
          if (!verification) break;
          i++;
        }
      }
      await redisClient.hdelAsync('active_games', msg.channel.id);
      return msg.send('See you soon!');
    } catch (err) {
      await redisClient.hdelAsync('active_games', msg.channel.id);
      throw err;
    }
  }
***REMOVED***

// Script
const script = {
  before: [
    "Do you believe that there are choices in life?\nThere are many people who lament the following:\nIf there only existed points in life where there were clear choices to make, we would be able to scrutinize those carefully and make decisions that would lead us to a better future.\n\nEvery time I hear people lament as such, I cast it off as a rather trivial worry.\nEven if you were given a clear choice, it wouldn't be meaningful at all, and there wouldn't be any such path to a better future.",
    "...Is this hard to understand?\nThen let's pretend that in front of you there are two strange boxes.\n\nIn other words, you have two clear choices.\nDo you open the red box, or the blue box?",
    "A lot of things would be uncertain even with that choice, wouldn't they?\n\nIf you don't have the option of opening neither, then your choice boils down to the natural impulse of opening the box that holds the better result for you.\nThen, after examining the shape and features of each, and pondering a great many things, you have to pick either the red or the blue.\n\n...If this was you, which box would you open?",
    "Red or blue?\n...If you were to go by their traditional meanings, then red would be a dangerous, threatening color.\nHowever, that doesn't automatically mean that it would be calm and relaxing inside the blue box, either.\nIn fact, it might even be that the colors are a trap, make you wary of the red box and have you open the blue.",
    "A trap?\n...Could it be the contents of the box aren't a reward, but rather a penalty?\n\nSee...? Now you're at a loss.\nYou're so conflicted over the choice between red and blue that you've started wishing there was an option to open neither and just leave.",
    "But there isn't. You have to open either the red box or the blue box.\nOh, I forgot to say this, but if you choose one box, the other will disappear.\nSo you'll never know the contents of box you don't open. I'll just put that that rule at the end there for you.",
    "Now. Why don't you choose?\nThe red box, or the blue box?\n\n...It's all right, you won't lose anything by picking either one. ...Come on now.",
    {
      text: 'Open the red box or the blue box?',
      options: ['red', 'blue', 'red box', 'blue box'],
      paths: ['red', 'blue', 'red', 'blue'],
    },
  ],
  red: [
    "Have you thought about it?\nIn the end, you chose this color, didn't you?\n\n...As soon as you chose, the other box disappeared.\nSo you can give up on the contents of that one, okay?\nThat's the rule.\n\nNow, open up the box you chose.",
    'Inside the box there was... a piece of caramel.',
    "...I know you're a little disappointed.\n\nWell that's only natural.\nNo matter how you look at it, it looks like you drew the dud.",
    'The correct box might have had a bar of chocolate in it, for all you know.\nNo, in fact, something incredible like a pair of tickets to Hawaii might have been in there.',
    "But even if you wanted to verify that, the other box has already disappeared.\nThere's no way you can check now.\n\nBut if you think about it from an optimistic point of view...\nJust maybe... the other box was empty, and this box was the winner.\n\nAnd being satisfied (or perhaps not) with such a cheap prize, you pop it into your mouth and start chewing it happily.",
    'So, what do you think in the end?\nIf you were given a second chance, would you try to open the other box?\n...But unfortunately, the chance to choose between the red box or the blue box has come and gone, never to be seen again.\nThe chance to change your selection will never come.',
    "Don't your parents often say: Every choice you make in life only happens once, so choose carefully?\nHee hee hee...\n\nSee? Choices aren't that great after all. ...Aren't you a little disillusioned now? Ahhahahahahaha...",
    {
      text:
        'Thanks for playing! If you liked this game, please consider supporting the developers of Higurashi!\n<https://store.steampowered.com/bundle/709/>',
      end: true,
    },
  ],
  blue: [
    "Have you thought about it?\nIn the end, you chose this color, didn't you?\n\n...As soon as you chose, the other box disappeared.\nSo you can give up on the contents of that one, okay?\nThat's the rule.\n\nNow, open up the box you chose.",
    'Inside the box there was... a stick of chewing gum.',
    "...I know you're a little disappointed.\n\nWell that's only natural.\nNo matter how you look at it, it looks like you drew the dud.",
    'The correct box might have had a bar of chocolate in it, for all you know.\nNo, in fact, something incredible like a pair of tickets to Hawaii might have been in there.',
    "But even if you wanted to verify that, the other box has already disappeared.\nThere's no way you can check now.\n\nBut if you think about it from an optimistic point of view...\nJust maybe... the other box was empty, and this box was the winner.\n\nAnd being satisfied (or perhaps not) with such a cheap prize, you pop it into your mouth and start chewing it happily.",
    'So, what do you think in the end?\nIf you were given a second chance, would you try to open the other box?\n...But unfortunately, the chance to choose between the red box or the blue box has come and gone, never to be seen again.\nThe chance to change your selection will never come.',
    "Don't your parents often say: Every choice you make in life only happens once, so choose carefully?\nHee hee hee...\n\nSee? Choices aren't that great after all. ...Aren't you a little disillusioned now? Ahhahahahahaha...",
    {
      text:
        'Thanks for playing! If you liked this game, please consider supporting the developers of Higurashi!\n<https://store.steampowered.com/bundle/709/>',
      end: true,
    },
  ],
  bothred: [
    "Have you thought about it?\nIn the end, you chose this color, didn't you?\n\n...As soon as you chose, the other box disappeared.\nSo you can give up on the contents of that one, okay?\nThat's the rule.\n\nNow, open up the box you chose.",
    'Inside the box there was... a stick of chewing gum.',
    '...Right now you\'re thinking: "That\'s it?"',
    "That's right, the contents of the red box and the blue box were a piece of caramel and a stick of chewing gum.\nYou might have thought you made the wrong choice before, but now seeing them together like this, you can't really say that either choice was the wrong one.\n\nWell, I guess everybody has their personal preferences.\nIf you prefer caramel to gum, for example.\n...You're definitely thinking of choosing to open the box again based on that preference.",
    '...The clear choices you wanted were basically this.\nThe selfish desire to open up both boxes and compare the contents, then pick the one most suited to you.',
    "But you see, reality is the same as this game.\nIf you pick one, the one you didn't choose disappears. So there's no way you could check the result.",
    "If at that time, if you had done this, or perhaps if you had done that... then it wouldn't be hard to imagine that you could be happier (or perhaps less happy) than you are right now.\nIn the end, you only have the pleasure of approving of or being disappointed by the choice that you did make.",
    "But that's fine.\nAfter all, didn't you enjoy the thrill of making the choice?\nIf, like now, you knew the contents of both boxes, then the choice between the red box or the blue box would just be a waste of time.\nBecause instead of this boring game about boxes, you could be looking at the quickly-changing evening summer sky, listening for the distant sound of thunder, and pondering if it's going to rain or not... that would be much more fun.",
    {
      text:
        'Thanks for playing! If you liked this game, please consider supporting the developers of Higurashi!\n<https://store.steampowered.com/bundle/709/>',
      end: true,
    },
  ],
  bothblue: [
    "Have you thought about it?\nIn the end, you chose this color, didn't you?\n\n...As soon as you chose, the other box disappeared.\nSo you can give up on the contents of that one, okay?\nThat's the rule.\n\nNow, open up the box you chose.",
    'Inside the box there was... a piece of caramel.',
    '...Right now you\'re thinking: "That\'s it?"',
    "That's right, the contents of the red box and the blue box were a piece of caramel and a stick of chewing gum.\nYou might have thought you made the wrong choice before, but now seeing them together like this, you can't really say that either choice was the wrong one.\n\nWell, I guess everybody has their personal preferences.\nIf you prefer caramel to gum, for example.\n...You're definitely thinking of choosing to open the box again based on that preference.",
    '...The clear choices you wanted were basically this.\nThe selfish desire to open up both boxes and compare the contents, then pick the one most suited to you.',
    "But you see, reality is the same as this game.\nIf you pick one, the one you didn't choose disappears. So there's no way you could check the result.",
    "If at that time, if you had done this, or perhaps if you had done that... then it wouldn't be hard to imagine that you could be happier (or perhaps less happy) than you are right now.\nIn the end, you only have the pleasure of approving of or being disappointed by the choice that you did make.",
    "But that's fine.\nAfter all, didn't you enjoy the thrill of making the choice?\nIf, like now, you knew the contents of both boxes, then the choice between the red box or the blue box would just be a waste of time.\nBecause instead of this boring game about boxes, you could be looking at the quickly-changing evening summer sky, listening for the distant sound of thunder, and pondering if it's going to rain or not... that would be much more fun.",
    {
      text:
        'Thanks for playing! If you liked this game, please consider supporting the developers of Higurashi!\n<https://store.steampowered.com/bundle/709/>',
      end: true,
    },
  ],
***REMOVED***
