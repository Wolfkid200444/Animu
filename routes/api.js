const redis = require('redis');
const bluebird = require('bluebird');
const moment = require('moment');
const { model } = require('mongoose');

const Log = model('Log');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = (app, client) => {
  app.get('/api', (req, res) => {
    res.json({ ApiStatus: 'online' });
  });

  app.get('/api/auth', async (req, res) => {
    if (!req.query.token) return res.json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      guildID: guild.id,
    });
  });

  app.get('/api/guild', async (req, res) => {
    if (!req.query.token) return res.json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        onlineMemberCount: guild.members.filter(
          m =>
            m.presence.status === 'online' ||
            m.presence.status === 'idle' ||
            m.presence.status === 'dnd'
        ).size,
      },
    });
  });

  app.get('/api/growth', async (req, res) => {
    if (!req.query.token) return res.json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const growthCycle = req.query.cycle || 7;
    const growth = [];

    for (let i = 0; i < growthCycle; i++) {
      const date = moment().subtract(i, 'days');
      growth.push(
        guild.members.filter(m =>
          moment(m.joinedAt).isSameOrBefore(date, 'day')
        ).size
      );
    }

    return res.json({
      growth,
    });
  });

  app.get('/api/logs', async (req, res) => {
    if (!req.query.token) return res.json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    const logs = await Log.find({ guildID: guild.id })
      .sort({ dateTime: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .exec();

    logs.forEach(
      log => (log.data.authorTag = client.users.get(log.data.authorID).tag)
    );

    return res.json({
      logs,
    });
  });
***REMOVED***
