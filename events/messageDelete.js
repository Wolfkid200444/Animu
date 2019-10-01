const { Event } = require('klasa');
const { model } = require('mongoose');

// Init
const Log = model('Log');

module.exports = class extends Event {
  async run(message) {
    if (!message.author) return;

    if (message.author.id === this.client.user.id) return;

    if (!require('../data/validGuilds').has(message.guild.id)) return;

    await new Log({
      guildID: message.guild.id,
      event: 'messageDelete',
      data: {
        authorID: message.author.id,
        channelID: message.channel.id,
        content: message.content,
        createdAt: message.createdAt,
        edits: message.edits,
        id: message.id,
        type: message.type,
      },
    }).save();

    if (message.guild.settings.logChannels.deletedMessages)
      message.guild.channels
        .get(message.guild.settings.logChannels.deletedMessages)
        .send(
          `A message by **${
            this.client.users.get(message.member.id).username
          }** was deleted at \`${new Date().toUTCString()}\` in **${
            message.channel.name
          }**:\n\`\`\`${message.content}\`\`\``,
        );
  }
***REMOVED***
