const redis = require('redis');
const bluebird = require('bluebird');
const moment = require('moment');
const { model } = require('mongoose');

const Profile = model('Profile');
const Log = model('Log');
const Guild = model('Guild');
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
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

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

  app.get('/api/channels', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      channels: guild.channels
        .filter(c => c.type === 'text')
        .map(c => {
          return { id: c.id, name: c.name ***REMOVED***
        }),
    });
  });

  app.get('/api/roles', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      roles: guild.roles.map(r => {
        return { id: r.id, name: r.name ***REMOVED***
      }),
    });
  });

  app.get('/api/growth', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

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

  app.get('/api/joined', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const joinedCycle = req.query.cycle || 7;
    const joined = [];

    for (let i = 0; i < joinedCycle; i++) {
      const date = moment().subtract(i, 'days');
      joined.push(
        guild.members.filter(m => moment(m.joinedAt).isSame(date, 'day')).size
      );
    }

    return res.json({
      joined,
    });
  });

  app.get('/api/logs', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;

    const logs = await Log.find({ guildID: guild.id })
      .sort({ dateTime: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .exec();

    logs.forEach(log => {
      log.data.authorTag = client.users.get(log.data.authorID).tag;
      log.data.authorAvatarUrl = client.users
        .get(log.data.authorID)
        .displayAvatarURL();
    });

    return res.json({
      logs,
    });
  });

  app.get('/api/leaderboards/levels', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    const membersRaw = await Profile.find({
      level: { $elemMatch: { guildID: guild.id } },
    });

    membersRaw.sort((a, b) => {
      const indexA = a.level.findIndex(r => r.guildID === guild.id);
      const indexB = b.level.findIndex(r => r.guildID === guild.id);
      return a.level[indexA].level > b.level[indexB].level ? -1 : 1;
    });

    const membersRaw2 = membersRaw.slice(0, 30);

    const members = [];

    membersRaw2.forEach(m => {
      const index = m.level.findIndex(r => r.guildID === guild.id);

      if (client.users.get(m.memberID))
        members.push({
          id: m.memberID,
          level: m.level[index].level,
          username: client.users.get(m.memberID).username,
          avatarURL: client.users.get(m.memberID).displayAvatarURL(),
        });
    });

    return res.json({
      members,
    });
  });

  app.get('/api/levelperks', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = await Guild.findOne({ guildID: guildID }).exec();

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  app.post('/api/levelperks', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = await Guild.findOne({ guildID: guildID }).exec();

    if (!req.body.level) return res.json({ err: 'No level provided' });
    if (!req.body.perkName) return res.json({ err: 'No perkName provided' });
    if (!req.body.perkValue) return res.json({ err: 'No perkValue provided' });

    await guild.addLevelPerk(
      req.body.level,
      req.body.perkName,
      req.body.perkValue
    );

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  app.get('/api/settings', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      settings: guild.settings,
    });
  });

  app.post('/api/settings', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });
    if (!req.body.key)
      return res
        .status(400)
        .json({ err: 'Key (Setting to update) not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    guild.settings[req.body.key] = req.body.value;

    return res.json({
      settings: guild.settings,
    });
  });
***REMOVED***
