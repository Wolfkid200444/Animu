//Dependencies
import { Event } from 'klasa';
import { MessageEmbed, GuildMember, TextChannel } from 'discord.js';
import mongoose from 'mongoose';
import moment from 'moment';
import _ from 'lodash';
import { IProfileModel } from '../models/Profile';

//Init
const Profile = <IProfileModel>mongoose.model('Profile');

module.exports = class extends Event {
  async run(member: GuildMember) {
    //Register Profile
    const profile = await Profile.register(member.id);

    const profileFind = await Profile.findOne({ memberID: member.id }).exec();

    if (
      !profileFind.reputation.find(
        guildRep => guildRep.guildID === member.guild.id
      )
    ) {
      profileFind.reputation.push({
        guildID: member.guild.id,
        rep: member.guild.settings.get('startingRep'),
      });

      await profileFind.save();
    }

    if (
      !profileFind.level.find(
        guildLevel => guildLevel.guildID === member.guild.id
      )
    ) {
      profileFind.level.push({
        guildID: member.guild.id,
        level: 1,
        exp: 0,
      });

      await profileFind.save();
    }

    if (member.guild.settings.get('joinRoles'))
      member.guild.settings.get('joinRoles').forEach(r => {
        if (member.guild.roles.has(r))
          member.roles.add(r, 'Assigning Member role');
      });

    if (
      profile.res === 'already_exists' &&
      member.guild.settings.get('mutedRole') &&
      _.includes(profile.profile.mutedIn, member.guild.id) &&
      member.guild.roles.has(member.guild.settings.get('mutedRole'))
    )
      member.roles.add(
        member.guild.settings.get('mutedRole'),
        'Assigning Muted role'
      );

    if (
      member.guild.settings.get('welcomeChannel') &&
      member.guild.settings.get('enableWelcomeMessage')
    ) {
      // Send Welcome message
      const welcomeEmbed = new MessageEmbed()
        .setTitle(`${member.displayName}, Welcome to ${member.guild.name}`)
        .setColor('#2196f3');

      // Constants Reference
      // $username = the username of the user that just joined
      // $nickname = the nickname of the member that just joined (if no nickname is given, username will be used)
      // $tag = full tag of the user that just joined (eg: Bruh#1234)
      // $discriminator = Discriminator of the member that just joined (eg: 6969)
      // $mention = Mention the new user that just joined
      // $accountcreationdate = Date of this user's account creation
      // $server = name of server
      // $membercount = number of members in server

      if (member.guild.settings.get('welcomeMessage'))
        welcomeEmbed.setDescription(
          member.guild.settings
            .get('welcomeMessage')
            // $username
            .split('$username')
            .join(member.user.username)
            // $nickname
            .split('$username')
            .join(member.displayName)
            // $tag
            .split('$tag')
            .join(member.user.tag)
            // $descriminator
            .split('$discriminator')
            .join(member.user.discriminator)
            // $mention
            .split('$mention')
            .join(member)
            // $accountcreationdate
            .split('$accountcreationdate')
            .join(moment(member.user.createdAt).format('MMMM Do YYYY'))
            // $server
            .split('$server')
            .join(member.guild.name)
            // $membercount
            .split('$membercount')
            .join(member.guild.memberCount)
        );
      if (member.guild.settings.get('welcomeImageURL'))
        welcomeEmbed.setImage(member.guild.settings.get('welcomeImageURL'));

      const welcomeChannel = member.guild.channels.get(
        member.guild.settings.get('welcomeChannel')
      );

      if (welcomeChannel instanceof TextChannel)
        welcomeChannel.send(welcomeEmbed);
    }
  }
};
