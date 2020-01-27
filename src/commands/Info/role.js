const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['role-info', 'roleinfo', 'rinfo'],
      requiredPermissions: ['EMBED_LINKS'],
      description: 'Get information on a role with name',
      cooldown: 10,
      extendedHelp:
        'Get information about a role including role permissions, color, name, creation date, and other details',
      usage: '<role:...string>',
      quotedStringSupport: true,
    });
    this.perms = {
      ADMINISTRATOR: 'Administrator',
      VIEW_AUDIT_LOG: 'View Audit Log',
      MANAGE_GUILD: 'Manage Server',
      MANAGE_ROLES: 'Manage Roles',
      MANAGE_CHANNELS: 'Manage Channels',
      KICK_MEMBERS: 'Kick Members',
      BAN_MEMBERS: 'Ban Members',
      CREATE_INSTANT_INVITE: 'Create Instant Invite',
      CHANGE_NICKNAME: 'Change Nickname',
      MANAGE_NICKNAMES: 'Manage Nicknames',
      MANAGE_EMOJIS: 'Manage Emojis',
      MANAGE_WEBHOOKS: 'Manage Webhooks',
      VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
      SEND_MESSAGES: 'Send Messages',
      SEND_TTS_MESSAGES: 'Send TTS Messages',
      MANAGE_MESSAGES: 'Manage Messages',
      EMBED_LINKS: 'Embed Links',
      ATTACH_FILES: 'Attach Files',
      READ_MESSAGE_HISTORY: 'Read Message History',
      MENTION_EVERYONE: 'Mention Everyone',
      USE_EXTERNAL_EMOJIS: 'Use External Emojis',
      ADD_REACTIONS: 'Add Reactions',
      CONNECT: 'Connect',
      SPEAK: 'Speak',
      MUTE_MEMBERS: 'Mute Members',
      DEAFEN_MEMBERS: 'Deafen Members',
      MOVE_MEMBERS: 'Move Members',
      USE_VAD: 'Use Voice Activity',
    };
    this.timestamp = new Timestamp('dddd, MMMM d YYYY');
  }

  run(msg, [role]) {
    role = msg.guild.roles.find((r) => r.name === role);

    if (!role)
      return new MessageEmbed()
        .setTitle('Role not found')
        .setDescription(
          "The role you're trying to get info for doesn't exist, double check your spelling and capitalization",
        )
        .setColor('#f44336');

    const allPermissions = Object.entries(role.permissions.serialize())
      .filter((perm) => perm[1])
      .map(([perm]) => this.perms[perm])
      .join(', ');

    return msg.sendEmbed(
      new MessageEmbed()
        .setColor(role.hexColor || 0xffffff)
        .addField('❯ Name', role.name, true)
        .addField('❯ ID', role.id, true)
        .addField('❯ Color', role.hexColor || 'None', true)
        .addField(
          '❯ Creation Date',
          this.timestamp.display(role.createdAt),
          true,
        )
        .addField('❯ Hoisted', role.hoist ? 'Yes' : 'No', true)
        .addField('❯ Mentionable', role.mentionable ? 'Yes' : 'No', true)
        .addField('❯ Permissions', allPermissions || 'None'),
    );
  }
};
