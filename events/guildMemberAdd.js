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
    gif:
      'https://media1.tenor.com/images/d015e7d6a223a4ad8062b55e8ed819ce/tenor.gif?itemid=13875061'
  },
  {
    string: '$ just joined. Everyone, look busy!',
    gif:
      'https://media1.tenor.com/images/235d27e0eb9d158b8b10826ca4adec96/tenor.gif?itemid=12952726'
  },
  {
    string: '$ just joined. Can I get a heal?',
    gif:
      'https://media1.tenor.com/images/2f7c0f74686f7d5135e5057fcb7c8396/tenor.gif?itemid=7689794'
  },
  {
    string: '$ joined your party.',
    gif:
      'https://media.tenor.com/images/3b8708ccc74bf6980868837ad2790072/tenor.gif'
  },
  {
    string: 'Welcome, $. Stay awhile and listen.',
    gif:
      'https://media1.tenor.com/images/4dddbe869272d69de51d5ee27c05681b/tenor.gif?itemid=13642327'
  },
  {
    string: 'Welcome, $. We were expecting you ( ͡° ͜ʖ ͡°)',
    gif:
      'https://media1.tenor.com/images/34d6e86b3b954c80d01328cc9d3e9834/tenor.gif?itemid=13423996'
  },
  {
    string: 'Welcome, $. We hope you brought pizza.',
    gif:
      'https://media1.tenor.com/images/00fe864635df8d9a410e47710da5d370/tenor.gif?itemid=8049271'
  },
  {
    string: 'A wild $ appeared',
    gif: 'https://media.giphy.com/media/4WFEIW3PXKD0ymdjVd/giphy.gif'
  },
  {
    string: 'Swoosh. $ just landed',
    gif:
      'https://media1.tenor.com/images/68a515c145f87d6461b60a4728e9e78c/tenor.gif?itemid=3566452'
  },
  {
    string: '$ just joined. Hide your bananas.',
    gif:
      'https://media1.tenor.com/images/da0a9549fc6948391f95e9bd43da37d5/tenor.gif?itemid=14027029'
  },
  {
    string: '$ just arrived. Seems OP - please nerf.',
    gif:
      'https://media1.tenor.com/images/d1923103b12ad82680616c1ebb9ada45/tenor.gif?itemid=13451225'
  },
  {
    string: '$ just slid into the server.',
    gif:
      'https://media1.tenor.com/images/2ab2c143eed45ea6bd478ac950ba214b/tenor.gif?itemid=11476106'
  },
  {
    string: 'Big $ showed up!',
    gif:
      'https://media1.tenor.com/images/d1e09b21dec248b488950cce7e62f562/tenor.gif?itemid=13204123'
  },
  {
    string: "Where's $? In the server!",
    gif:
      'https://media1.tenor.com/images/cfee6bb543427ab79202ff05ba7d0765/tenor.gif?itemid=3532023'
  },
  {
    string: '$ hopped into the server. Kangaroo!!',
    gif:
      'https://media1.tenor.com/images/8de87c71ccb949f17df67cf0110d52eb/tenor.gif?itemid=12340278'
  },
  {
    string: '$ just showed up. Hold my beer.',
    gif:
      'https://media1.tenor.com/images/f3ebc3a343957b612786f17a03c12780/tenor.gif?itemid=13528511'
  }
];

module.exports = client => {
  client.on('guildMemberAdd', async member => {
    const aldovia = client.guilds.get('556442896719544320');
    const newMembersChannel = aldovia.channels.get('586102106373619723');

    const welcomeMsg = _.sample(welcomeMessages);

    //Register Profile
    const profile = await Profile.register(member.id);

    if (profile.res === 'already_exists')
      profile.profile.roles.forEach(roleName => {
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
        .setColor('#2196f3')
    );
  });
***REMOVED***
