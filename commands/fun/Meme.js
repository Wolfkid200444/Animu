//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const _ = require('lodash');
const axios = require('axios');

//Main
module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      aliases: [],
      group: 'fun',
      memberName: 'meme',
      throttling: {
        usages: 1,
        duration: 10
      },
      description: 'View memes',
      details:
        'Use this command to view memes from different subreddits, valid subreddits are: r/dankmemes, r/pewdiepiesubmissions, r/animemes (default). You can also use this command in DM',
      examples: ['meme', 'meme r/dankmemes', 'meme r/pewdiepiesubmissions'],
      args: [
        {
          key: 'subreddit',
          prompt: 'Which subreddit do you want to view memes from?',
          oneOf: ['r/animemes', 'r/dankmemes', 'r/pewdiepiesubmissions'],
          type: 'string',
          default: 'r/animemes'
        }
      ]
    });
  }

  async run(msg, { subreddit }) {
    const res = await axios.get(
      `https://www.reddit.com/${subreddit}.json?sort=hot&limit=100`
    );

    const posts = res.data.data.children.filter(
      post => post.data.thumbnail !== null
    );

    const randomPost = _.sample(posts).data;

    msg.embed(
      new RichEmbed()
        .setTitle(randomPost.title)
        .setImage(randomPost.url)
        .setColor('#2196f3')
    );
  }
***REMOVED***
