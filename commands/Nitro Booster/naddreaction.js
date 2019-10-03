const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const prompt = require('discordjs-prompter');

//Init
const Reaction = mongoose.model('Reaction');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['naddreact', 'naddr'],
      requiredPermissions: ['EMBED_LINKS'],
      bucket: 2,
      cooldown: 5,
      description: 'Add Reaction (Nitro Boosters Only)',
      extendedHelp:
        'Add a gif for an existing reaction or create a new reaction. First argument is the reactionName while second argument is url for the gif to add for that reaction',
      usage: '<reactionName:string> <gifURL:string>',
      usageDelim: ' ',
    });
  }

  async run(msg, [reactionName, gifURL]) {
    const aldovia = this.client.guilds.get('556442896719544320');

    if (
      !aldovia.members.get(msg.author.id) ||
      !aldovia.members
        .get(msg.author.id)
        .roles.find((r) => r.name === 'Nitro Booster')
    )
      return msg.reply('Only nitro boosters can use this command');

    const reaction = await Reaction.findOne({
      name: reactionName.toLowerCase(),
    }).exec();

    if (!reaction) {
      const res = await prompt.reaction(msg.channel, {
        question: `The reaction for which you are adding URL doesn't exist, would you like to create new reaction named \`${reactionName}\`(Please make sure there's no typo)`,
        userId: msg.author.id,
      });

      if (!res || res === 'no')
        return msg.sendEmbed(
          new MessageEmbed()
            .setTitle('Cancelled')
            .setDescription('New reaction creation is cancelled')
            .setColor('#f44336'),
        );

      await new Reaction({
        name: reactionName.toLowerCase(),
        urls: [gifURL.trim()],
      }).save();

      aldovia.channels
        .get('604690435230924849')
        .send(
          `${msg.author.username} created a new reaction ${reactionName} with gif ${gifURL}`,
        );

      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('New reaction created')
          .setDescription(`New reaction, \`${reactionName}\` is created`)
          .setColor('#2196f3'),
      );
    } else {
      reaction.urls.push(gifURL.trim());
      await reaction.save();

      aldovia.channels
        .get('604690435230924849')
        .send(
          `${msg.author.username} added gif ${gifURL} for ${reactionName} reaction`,
        );

      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('New GIF added')
          .setDescription(`New GIF is added for reaction \`${reactionName}\``)
          .setColor('#2196f3'),
      );
    }
  }
***REMOVED***
