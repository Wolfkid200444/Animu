//Dependencies
const mongoose = require('mongoose');
const { RichEmbed } = require('discord.js');
const keys = require('../config/keys');
const { changeReputation } = require('../helpers/profile');

//Init
const Profile = mongoose.model('Profile');

module.exports = (app, client) => {
  app.get('/', (req, res) => {
    res.json({ status: 'Online' });
  });

  app.post('/webhooks', async (req, res) => {
    const apiKey = req.body.apiKey;
    const type = req.body.type;
    const payload = req.body.payload;

    if (!apiKey || apiKey !== keys.aldoviaAPIKey)
      return res.json({ error: 'Invalid API key' });

    if (!type) return res.json({ error: 'No type provided' });

    if (!payload) return res.json({ error: 'No payload provided' });

    if (type === 'CHANGE_REPUTATION') {
      const memberID = payload.memberID;
      const reputation = payload.reputation;
      const change = payload.change;

      if (
        client.guilds
          .get('556442896719544320')
          .members.get(memberID)
          .roles.find(r => {
            return (
              r.name === 'Moderator' ||
              r.name === 'Senior Moderator' ||
              r.name === '👑 Server Admin 👑'
            );
          })
      )
        return res.json({ error: 'Mod/server admin detected' });

      await changeReputation(memberID, change, reputation);

      const profileCheck = await Profile.findOne({ memberID }).exec();

      if (profileCheck.reputation <= 20)
        client.guilds
          .get('556442896719544320')
          .members.get(memberID)
          .send(
            new RichEmbed()
              .setTitle('Low Reputation')
              .setDescription(
                `Your reputation has dropped to ${
                  profileCheck.reputation
                }, you're in gray zone and can be banned at any time unless you improve your reputation`
              )
              .setColor('#f44336')
          );

      if (profileCheck.reputation <= 0) {
        profileCheck.reputation = 20;
        await client.guilds
          .get('556442896719544320')
          .members.get(memberID)
          .send(
            'Your reputation has dropped to 0, thus you are hereby banned from Aldovia'
          );
        await client.guilds
          .get('556442896719544320')
          .members.get(memberID)
          .ban({ days: 1, reason: 'Reputation dropped to 0' });
      }

      return res.json({ success: 'Reputation successfully modified' });
    }
  });
***REMOVED***
