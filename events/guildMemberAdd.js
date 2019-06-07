//Dependencies
const mongoose = require('mongoose');
const { RichEmbed } = require('discord.js');
const _ = require('lodash');

//Init
const Profile = mongoose.model('Profile');

//Welcome Messages
const welcomeMessages = [
  {
    string: '$ just joined the server - glhf!',
    gif: 'https://tenor.com/6nHt.gif'
  },
  {
    string: '$ just joined. Everyone, look busy!',
    gif: 'https://tenor.com/2vK6.gif'
  },
  {
    string: '$ just joined. Can I get a heal?',
    gif: 'https://tenor.com/GqC6.gif'
  },
  { string: '$ joined your party.', gif: 'https://tenor.com/7M14.gif' },
  {
    string: 'Welcome, $. Stay awhile and listen.',
    gif: 'https://tenor.com/5o9H.gif'
  },
  {
    string: 'Welcome, $. We were expecting you ( ͡° ͜ʖ ͡°)',
    gif: 'https://tenor.com/4ume.gif'
  },
  {
    string: 'Welcome, $. We hope you brought pizza.',
    gif: 'https://tenor.com/HV87.gif'
  },
  {
    string: 'A wild $ appeared',
    gif: 'https://media.giphy.com/media/4WFEIW3PXKD0ymdjVd/giphy.gif'
  },
  { string: 'Swoosh. $ just landed', gif: 'https://tenor.com/o7XA.gif' },
  {
    string: '$ just joined. Hide your bananas.',
    gif: 'https://tenor.com/61ez.gif'
  },
  {
    string: '$ just arrived. Seems OP - please nerf.',
    gif: 'https://tenor.com/4Brp.gif'
  },
  { string: '$ just slid into the server.', gif: 'https://tenor.com/WjCE.gif' },
  { string: 'Big $ showed up!', gif: 'https://tenor.com/3y9T.gif' },
  { string: "Where's $? In the server!", gif: 'https://tenor.com/oY0h.gif' },
  {
    string: '$ hopped into the server. Kangaroo!!',
    gif: 'https://tenor.com/ZWqU.gif'
  },
  {
    string: '$ just showed up. Hold my beer.',
    gif: 'https://tenor.com/4VxX.gif'
  }
];

module.exports = client => {
  client.on('guildMemberAdd', async member => {
    const aldovia = client.guilds.get('556442896719544320');
    const newMembersChannel = aldovia.channels.get('586102106373619723');

    const welcomeMsg = _.sample(welcomeMessages);

    //Register Profile
    const profile = await Profile.register(member.id);

    if (profile.roles.length)
      profile.roles.forEach(roleName => {
        const role = aldovia.roles.find(r => r.name === roleName);
        member.addRole(role, 'Assigning roles this member had before leaving');
      });
    else
      member.addRole(
        aldovia.roles.find(r => r.name === 'Member'),
        'Assigning Member role'
      );

    newMembersChannel.send(
      new RichEmbed()
        .setTitle(welcomeMsg.string.replace('$', member.displayName))
        .setImage(welcomeMsg.gif)
    );
  });
***REMOVED***
