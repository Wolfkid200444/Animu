//Dependencies
const keys = require('../config/keys');

module.exports = (app, client) => {
  app.post('/webhooks', async (req, res) => {
    const apiKey = req.body.apiKey;
    const type = req.body.type;
    const payload = req.body.payload;

    if (!apiKey || apiKey !== keys.animuAPIKey)
      return res.json({ error: 'Invalid API key' });

    if (!type) return res.json({ error: 'No type provided' });

    if (!payload) return res.json({ error: 'No payload provided' });

    if (type === 'CHANGE_REPUTATION') {
      const memberID = payload.memberID;
      const reputation = payload.reputation;
      const change = payload.change;

      await client.users
        .get(memberID)
        .editReputation(change, reputation, '556442896719544320');

      return res.json({ success: 'Reputation successfully modified' });
    }
  });
};
