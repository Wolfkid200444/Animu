const { Command, Duration } = require('klasa');
const { model } = require('mongoose');

//Init
const Profile = model('Profile');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 6,
      requiredPermissions: ['BAN_MEMBERS', 'EMBED_LINKS'],
      runIn: ['text'],
      description: 'Mutes a mentioned user',
      usage: '[when:time] <member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [when, member, reason]) {
    if (member.id === msg.author.id) throw 'Why would you mute yourself?';
    if (member.id === this.client.user.id)
      throw 'Have I done something wrong? (*>﹏<*)';

    if (member.roles.highest.position >= msg.member.roles.highest.position)
      throw 'You cannot mute this user.';

    if (!msg.guild.settings.mutedRole)
      throw 'You first have to define a muted role, to do that, use `conf set mutedRole @role`';

    if (member.roles.has(msg.guild.settings.mutedRole))
      throw 'The member is already muted.';
    await member.roles.add(msg.guild.settings.mutedRole);

    const profile = await Profile.findOne({ memberID: msg.member.id }).exec();

    profile.mutedIn.push(msg.guild.id);

    await profile.save();

    if (when) {
      await this.client.schedule.create('unmute', when, {
        data: {
          guild: msg.guild.id,
          user: member.id,
        },
      });
      return msg.sendMessage(
        `${member.user.tag} got temporarily muted for ${Duration.toNow(when)}.${
          reason ? ` With reason of: ${reason}` : ''
        }`
      );
    }

    return msg.sendMessage(
      `${member.user.tag} got muted.${
        reason ? ` With reason of: ${reason}` : ''
      }`
    );
  }
***REMOVED***
