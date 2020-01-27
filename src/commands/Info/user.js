const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { trimArray } = require('../../util/util');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['user-info', 'userinfo', 'uinfo'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Get information about a user',
      cooldown: 10,
      usage: '[user:user]',
    });
    this.activities = {
      PLAYING: 'Playing',
      STREAMING: 'Streaming',
      WATCHING: 'Watching',
      LISTENING: 'Listening to',
    };
  }

  async run(msg, [user = msg.author]) {
    const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
    const embed = new MessageEmbed()
      .setThumbnail(user.displayAvatarURL({ format }))
      .addField('❯ Name', user.tag, true)
      .addField('❯ ID', user.id, true)
      .addField(
        '❯ Discord Join Date',
        moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A'),
        true,
      )
      .addField('❯ Bot?', user.bot ? 'Yes' : 'No', true);

    if (msg.channel.type === 'text') {
      try {
        const member = await msg.guild.members.get(user.id);
        const roles = member.roles
          .array()
          .sort((a, b) => b.position - a.position)
          .map((role) => role.name);

        embed
          .setColor(member.displayHexColor)
          .setDescription(
            member.presence.activity
              ? `${this.activities[member.presence.activity.type]} **${
                  member.presence.activity.name
                }**`
              : '',
          )
          .addField(
            '❯ Server Join Date',
            moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A'),
            true,
          )
          .addField('❯ Nickname', member.nickname || 'None', true)
          .addField('❯ Highest Role', member.roles.highest.name, true)
          .addField(
            '❯ Hoist Role',
            member.roles.hoist ? member.roles.hoist.name : 'None',
            true,
          )
          .addField(
            `❯ Roles (${roles.length})`,
            roles.length ? trimArray(roles, 10).join(', ') : 'None',
          );
      } catch (err) {
        embed.setFooter(
          'Failed to resolve member, showing basic user information instead.',
        );
      }
    }
    return msg.send(embed);
  }
};
