const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Profile = mongoose.model('Profile');

function getProfileEmbed(msg, profile) {
  const profileEmbed = new RichEmbed()
    .setTitle(msg.guild.members.get(profile.memberID).displayName)
    .setDescription(profile.description)
    .addField('Favorite Anime', profile.favoriteAnime)
    .setColor(profile.profileColor);

  if (profile.marriedTo) profileEmbed.addField('Married To', profile.marriedTo);

  const moderatorRole = msg.guild.roles.find(r => r.name === 'Moderator');
  const seniorModeratorRole = msg.guild.roles.find(
    r => r.name === 'Senior Moderator'
  );
  const serverAdminRole = msg.guild.roles.find(
    r => r.name === '👑 Server Admin 👑'
  );

  if (msg.guild.members.get(profile.memberID).roles.has(moderatorRole.id))
    profileEmbed.setFooter('Moderator');
  else if (
    msg.guild.members.get(profile.memberID).roles.has(seniorModeratorRole.id)
  )
    profileEmbed.setFooter('Senior Moderator');
  else if (
    msg.guild.members.get(profile.memberID).roles.has(serverAdminRole.id)
  )
    profileEmbed.setFooter('👑 Server Admin');
  else {
    //Adding fields that mods can't have
    profileEmbed
      .addField(
        'Rewards',
        `Silver: ${profile.rewards.silver}\nGold: ${
          profile.rewards.gold
        }\nPlatinum: ${profile.rewards.platinum}`
      )
      .addField(
        'Reputation',
        `${profile.reputation <= 20 ? '⚠️' : ''} ${profile.reputation}%`
      );

    //Adding badge
    if (profile.activeBadge) profileEmbed.setFooter(profile.activeBadge);
  }

  return profileEmbed;
}

async function changeReputation(memberID, change, reputation) {
  const profile = await Profile.findOne({ memberID }).exec();

  if (!profile) await Profile.register(memberID);

  if (change === '+')
    await Profile.updateOne({ memberID }, { $inc: { reputation: reputation } });
  else
    await Profile.updateOne(
      { memberID },
      { $inc: { reputation: -reputation } }
    );
}

//Exports
module.exports.getProfileEmbed = getProfileEmbed;
module.exports.changeReputation = changeReputation;
