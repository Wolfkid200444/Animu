const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'See how fast you can type a given sentence',
      usage: '<easy|medium|hard|extreme|impossible>',
    });

    this.operations = ['+', '-', '*'];
    this.times = {
      easy: 25000,
      medium: 20000,
      hard: 15000,
      extreme: 10000,
      impossible: 5000,
    ***REMOVED***
  }

  async run(msg, [difficulty]) {
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    const time = this.times[difficulty];
    await msg.reply(stripIndents`
			**You have ${time / 1000} seconds to type this sentence.**
			${sentence}
		`);
    const now = Date.now();
    const msgs = await msg.channel.awaitMessages(
      res => res.author.id === msg.author.id,
      {
        max: 1,
        time,
      }
    );
    if (!msgs.size || msgs.first().content !== sentence)
      return msg.reply('Sorry! You lose!');
    return msg.reply(
      `Nice job! 10/10! You deserve some cake! (Took ${(Date.now() - now) /
        1000} seconds)`
    );
  }
***REMOVED***

const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.',
  'How razorback-jumping frogs can level six piqued gymnasts!',
  'Amazingly few discotheques provide jukeboxes.',
  "I am so blue I'm greener than purple.",
  "I stepped on a Corn Flake, now I'm a Cereal Killer.",
  'On a scale from one to ten what is your favourite colour of the alphabet?',
  'The sparkly lamp ate a pillow then punched Larry.',
  'My world is where everybody is a pony and we all eat rainbows and poop butterflies.',
  'If your canoe is stuck in a tree with the headlights on, how many pancakes does it take to get to the moon?',
  "There's a purple mushroom in my backyard, screaming Taco's!",
  'When life gives you lemons, chuck them at people you hate.',
  'I think I will buy the red car, or I will lease the blue one.',
  'Italy is my favorite country; in fact, I plan to spend two weeks there next year.',
  "She borrowed the book from him many years ago and hasn't yet returned it.",
  'Lets all be unique together until we realise we are all the same.',
  'If Purple People Eaters are real… where do they find purple people to eat?',
  'The waves were crashing on the shore; it was a lovely sight.',
  'This is the last random sentence I will be writing and I am going to stop mid-sent.',
  'The memory we used to share is no longer coherent.',
  'She did not cheat on the test, for it was not the right thing to do.',
  'She only paints with bold colors; she does not like pastels.',
  'Malls are great places to shop; I can find everything I need under one roof.',
  'The body may perhaps compensates for the loss of a true metaphysics.',
  'They got there early, and they got really good seats.',
  'Everyone was busy, so I went to the movie alone.',
  "Yeah, I think it's a good environment for learning English.",
  "I would have gotten the promotion, but my attendance wasn't good enough.",
  'There were white out conditions in the town; subsequently, the roads were impassable.',
  "If you like tuna and tomato sauce- try combining the two. It's really not as bad as it sounds.",
];
