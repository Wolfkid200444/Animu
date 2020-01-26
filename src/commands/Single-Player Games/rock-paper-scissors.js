const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['rps'],
      cooldown: 10,
      description: 'Play Rock-Paper-Scissors',
      usage: '<rock|paper|scissors>',
    });
    this.choices = ['rock', 'paper', 'scissors'];
  }

  async run(msg, [choice]) {
    choice = choice.toLowerCase();

    const response = this.choices[
      Math.floor(Math.random() * this.choices.length)
    ];
    if (choice === 'rock') {
      if (response === 'rock') return msg.reply('Rock! Aw... A tie...');
      if (response === 'paper') return msg.reply('Paper! Yes! I win!');
      if (response === 'scissors')
        return msg.reply('Scissors! Aw... I lose...');
    }
    if (choice === 'paper') {
      if (response === 'rock') return msg.reply('Rock! Aw... I lose...');
      if (response === 'paper') return msg.reply('Paper! Aw... A tie...');
      if (response === 'scissors') return msg.reply('Scissors! Yes! I win!');
    }
    if (choice === 'scissors') {
      if (response === 'rock') return msg.reply('Rock! Yes! I win!');
      if (response === 'paper') return msg.reply('Paper! Aw... I lose...');
      if (response === 'scissors') return msg.reply('Scissors! Aw... A tie...');
    }
  }
***REMOVED***
