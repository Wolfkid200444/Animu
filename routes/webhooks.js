//Dependencies
const mongoose = require('mongoose');
const keys = require('../config/keys');

//Init
const Profile = mongoose.model('Profile');

module.exports = (app, client) => {
  app.get('/', (req, res) => {
    res.json({ status: 'Online' });
  });

  app.get('/webhooks', async (req, res) => {
    const apiKey = req.body.apiKey;
    const type = req.body.type;
    const payload = req.body.payload;

    if (!apiKey || apiKey !== keys.aldoviaAPIKey))
      return res.json({ error: 'Invalid API key' });

    if (!type) return res.json({ error: 'No type provided' });

    if (!payload) return res.json({ error: 'No payload provided' });

    if (type === 'CHANGE_REPUTATION') {
      const memberID = payload.memberID;
      const reputation = payload.reputation;
      const change = payload.change;

      let profile = await Profile.findOne({ memberID }).exec();

      if (!profile) profile = await profile.register(memberID);

      if (change === '+') profile.reputation += reputation;
      else profile.reputation -= reputation;

      profile.save();
    }
  });
***REMOVED***
