const { RichEmbed } = require('discord.js');

function getProfileEmbed(msg, profile) {
  const profileEmbed = new RichEmbed()
    .setTitle(msg.guild.members.get(profile.memberID).displayName)
    .setDescription(profile.description)
    .addField(
      'Rewards',
      `Silver: ${profile.rewards.silver}\nGold: ${
        profile.rewards.gold
      }\nPlatinum: ${profile.rewards.platinum}`
    )
    .addField(
      'Reputation',
      `${profile.reputation <= 20 ? '⚠️' : ''} ${profile.reputation}%`
    )
    .addField('Favorite Anime', profile.favoriteAnime)
    .setColor(profile.profileColor);

  if (profile.activeBadge) profileEmbed.setFooter(profile.activeBadge);
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

  return profileEmbed;
}

//Exports
module.exports.getProfileEmbed = getProfileEmbed;
