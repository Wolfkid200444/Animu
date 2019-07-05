const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['m', 'reddit'],
      cooldown: 10,
      description: 'View memes from Reddit',
      extendedHelp:
        'View memes from different subreddits. Valid subreddits are: dankmemes, animemes, pewdiepiesubmissions',
      usage: '[dankmemes|animemes|pewdiepiesubmissions]'
    });
  }

  async run(msg, [subreddit = 'animemes']) {
    const res = await axios.get(
      `https://www.reddit.com/r/${subreddit}.json?sort=hot&limit=100`
    );

    const posts = res.data.data.children.filter(
      post => post.data.thumbnail !== null
    );

    const randomPost = _.sample(posts).data;

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(randomPost.title)
        .setImage(randomPost.url)
        .setColor('#2196f3')
    );
  }
***REMOVED***
