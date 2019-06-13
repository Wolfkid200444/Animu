//Dependencies
const { Command } = require('discord.js-commando');
const Minesweeper = require('discord.js-minesweeper');

//Main
module.exports = class MinesweeperCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'minesweeper',
      aliases: [],
      group: 'games',
      memberName: 'minesweeper',
      throttling: {
        usages: 1,
        duration: 120
      },
      description: 'Play a game of minesweeper',
      examples: ['minesweeper', 'minesweeper 5 5 10'],
      args: [
        {
          key: 'rows',
          prompt: 'How many rows?',
          type: 'integer',
          min: 4,
          max: 20
        },
        {
          key: 'columns',
          prompt: 'How many columns?',
          type: 'integer',
          min: 4,
          max: 20
        },
        {
          key: 'mines',
          prompt: 'How many mines?',
          type: 'integer',
          min: 1
        }
      ]
    });
  }

  async run(msg, { rows, columns, mines }) {
    const minesweeper = new Minesweeper({
      rows,
      columns,
      mines,
      revealFirstCell: true
    });
    const matrix = minesweeper.start();

    return matrix
      ? msg.say(matrix)
      : msg.say(':warning: The provided data is invalid.');
  }
***REMOVED***
