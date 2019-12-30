const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const SelfRole = mongoose.model('SelfRole');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      runIn: ['text'],
      requiredPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
      description: 'Create some weird af self roles',
      usage: '<emoji:string> <roleName:...string>',
      usageDelim: ' ',
      quotedStringSupport: true,
      extendedHelp:
        "\
Create a new Self Role\n\
Before you create a new self role, make sure 'selfRolesChannel' & 'selfRolesMessage' is set, to modify those 2 settings, use 'conf set selfRolesChannel #channel'\
or 'conf set selfRolesMessage messageID'\n\
Once you've set up both configs, you can create a new self role using this command\n\
\n\
Examples:\n\
- addselfrole 😂 Retard\n\
- addselfrole 🚹 Female\n\
- addselfrole 🎉 Event Ping\n\
\n\
You can also use custom emotes\n\
For more help, visit this URL: https://aldovia.moe/how-to-set-up-self-roles/\
",
    });
  }

  async run(msg, [emoji, roleName]) {
    const role = msg.guild.roles.find(r => r.name === roleName);
    if (this.client.emojis.find(e => e.name === emoji.split(':')[1]))
      emoji = this.client.emojis.find(e => e.name === emoji.split(':')[1]);

    if (
      !msg.guild.settings.selfRolesChannel ||
      !msg.guild.settings.selfRolesMessage
    )
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No self role channel/msg found',
          description:
            'The self role channel/msg is not configured, please configure it using `conf` command',
          color: '#f44336',
        })
      );

    if (!role)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'No Emoji/role found',
          description: 'The emoji/role name that you provided is/are invalid',
          color: '#f44336',
        })
      );

    const rCh = msg.guild.channels.get(msg.guild.settings.selfRolesChannel);

    const rMsg = await rCh.messages.fetch(msg.guild.settings.selfRolesMessage);

    if (!rMsg || !rCh)
      return msg.sendMessage(
        new MessageEmbed({
          title: 'Invalid self role channel/msg',
          description:
            'The self role channel/msg that you provided is/are invalid',
          color: '#f44336',
        })
      );

    rMsg.react(emoji);

    await new SelfRole({
      guildID: msg.guild.id,
      messageID: msg.guild.settings.selfRolesMessage,
      emojiName: emoji,
      roleName: roleName,
    }).save();

    return msg.sendMessage(
      new MessageEmbed({
        title: 'Self Role Added',
        description: 'Self role is successfully added',
        color: '#2196f3',
      })
    );
  }
***REMOVED***
