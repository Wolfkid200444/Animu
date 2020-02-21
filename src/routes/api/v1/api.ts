// Imports
import express, { Application, Request, Response, NextFunction } from 'express';
import { KlasaClient } from 'klasa';
import redis from 'redis';
import bluebird from 'bluebird';
import moment from 'moment';
import { botEnv } from '../../../config/keys';
import { model } from 'mongoose';
import { ISelfRoleModel } from '../../../models/SelfRole';
import { TextChannel } from 'discord.js';

// Init
const api = express.Router();
const SelfRole = <ISelfRoleModel>model('SelfRole');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

// Globals
const version = 1.0;

module.exports = (app: Application, client: KlasaClient) => {
  // Middlewares
  api.use(async (req: Request, res: Response, next: NextFunction) => {
    if (botEnv === 'production')
      return res
        .status(400)
        .json({ code: 400, error: 'API not ready for production' });
    next();
  });

  api.use(
    ['/guilds*'],
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      // No Token
      if (!token)
        return res.status(401).json({ code: 401, error: 'No token provided' });

      // Token not found
      if (!(await redisClient.hexistsAsync('auth_tokens_v1', token)))
        return res.status(401).json({ code: 401, error: 'Invalid Token' });

      // Fetching User
      const userID = await redisClient.hgetAsync('auth_tokens_v1', token);
      const user = client.users.get(userID);

      req['user'] = user;
      next();
    }
  );

  api.use(
    ['/guilds/:id*'],
    async (req: Request, res: Response, next: NextFunction) => {
      // Fetching Guild
      const guild = client.guilds.get(req.params.id);

      if (!guild)
        return res.status(404).json({ code: 404, error: 'No guild found' });

      if (guild.ownerID !== req.user.id)
        return res.status(401).json({ code: 401, error: 'Access Denied' });

      req['guild'] = guild;
      next();
    }
  );

  api.use(
    ['/guilds/:id/members/:memberID*'],
    async (req: Request, res: Response, next: NextFunction) => {
      // Fetching Guild
      const member = req.guild.members.get(req.params.memberID);

      if (!member)
        return res.status(404).json({ code: 404, error: 'No member found' });

      req['member'] = member;
      next();
    }
  );

  // Root Route
  api.get('/', (req, res) => {
    return res.json({ active: true });
  });

  // Version
  api.get(['/v', '/ver', '/version'], (req, res) => {
    return res.json({ version: version });
  });

  // Get IDs of all guilds this user is in
  api.get('/guilds', (req, res) => {
    const guildIDs = client.guilds
      .filter(g => g.members.has(req.user.id))
      .array()
      .map(g => g.id);

    return res.json({
      guilds: guildIDs,
    });
  });

  // Get Info of a guild (must be owner)
  api.get('/guilds/:id', (req, res) => {
    return res.json({
      guild: req.guild,
    });
  });

  // Provides Stats of a guild
  // -> Active Now Count
  // -> Growth Rate
  // -> Join Rate
  // ---------------
  // Query Params:
  // growthCycle - number of days to show growthRate for (int)
  // joinRate - number of days to show joinRate for (int)
  api.get('/guilds/:id/stats', (req, res) => {
    const growthRate = [];
    const joinRate = [];

    const growthCycle = parseInt(req.query.growthCycle) || 7;
    const joinCycle = parseInt(req.query.joinCycle) || 7;

    const activeNowCount = req.guild.members.filter(
      m =>
        m.presence.status === 'online' ||
        m.presence.status === 'idle' ||
        m.presence.status === 'dnd'
    ).size;

    for (let i = 0; i < growthCycle; i++) {
      const date = moment().subtract(i, 'days');
      growthRate.push(
        req.guild.members.filter(m =>
          moment(m.joinedAt).isSameOrBefore(date, 'day')
        ).size
      );
    }

    for (let i = 0; i < joinCycle; i++) {
      const date = moment().subtract(i, 'days');
      joinRate.push(
        req.guild.members.filter(m => moment(m.joinedAt).isSame(date, 'day'))
          .size
      );
    }

    return res.json({
      stats: {
        activeNowCount,
        growthRate,
        joinRate,
      },
    });
  });

  // Fetch IDs of Staff members (members with moderation-related permissions)
  api.get('/guilds/:id/staff', (req, res) => {
    const staff = req.guild.members
      .filter(
        m =>
          m.hasPermission('ADMINISTRATOR') ||
          m.hasPermission('MANAGE_GUILD') ||
          m.hasPermission('BAN_MEMBERS') ||
          m.hasPermission('KICK_MEMBERS')
      )
      .array()
      .map(m => m.id);

    return res.json({
      staff,
    });
  });

  // Fetch ID's of all the members in a guild
  api.get('/guilds/:id/members', (req, res) => {
    return res.json({
      members: req.guild.members.array().map(m => m.id),
    });
  });

  // Fetch a member in a guild
  api.get('/guilds/:id/members/:memberID', (req, res) => {
    return res.json({
      member: req.member,
    });
  });

  // Kick a guild Member
  //! Untested
  api.post('/guilds/:id/members/:memberID/kick', async (req, res) => {
    const reason = req.query.reason || 'Kicked using API';

    if (!req.member.kickable)
      return res.status(403).json({
        status: 403,
        error: 'Not enough perms to kick the specified member',
      });

    const member = await req.member.kick(reason);

    return res.json({
      member,
    });
  });

  // Ban a guild Member
  //! Untested
  api.post('/guilds/:id/members/:memberID/ban', async (req, res) => {
    const reason = req.query.reason || 'Banned using API';

    if (!req.member.bannable)
      return res.status(403).json({
        status: 403,
        error: 'Not enough perms to ban the specified member',
      });

    const member = await req.member.ban({ reason });

    return res.json({
      member,
    });
  });

  // Fetch settings of a guild
  api.get('/guilds/:id/settings', (req, res) => {
    return res.json({
      settings: req.guild.settings,
    });
  });

  // Update a setting of a guild
  // -------
  // Body Params:
  // key - key of Setting to update
  // value - new value for the setting to update
  //! Untested
  api.post('/guilds/:id/settings', (req, res) => {
    if (!req.body.key || !req.body.value)
      return res
        .status(400)
        .json({ code: 400, error: "Key or Value wasn't provided" });

    req.guild.settings.update(req.body.key, req.body.value);

    return res.json({
      settings: req.guild.settings,
    });
  });

  // Fetch Self Roles of a guild
  api.get('/guilds/:id/selfroles', async (req, res) => {
    const selfRoles = await SelfRole.find({ guildID: req.guild.id }).exec();

    return res.json({
      selfRoles,
    });
  });

  // Create a new Self Role for a guild
  // --------
  // Body Params:
  // role - ID of role
  // emoji - name of emoji
  //! Untested
  api.post('/guilds/:id/selfroles', async (req, res) => {
    if (!req.body.role || !req.body.emoji)
      return res
        .status(400)
        .json({ code: 400, error: "Role or Emoji wasn't provided" });

    const role = req.guild.roles.get(req.body.role);
    let emoji = req.body.emojiName;

    if (client.emojis.find(e => e.name === req.body.emojiName.split(':')[1]))
      emoji = client.emojis.find(
        e => e.name === req.body.emojiName.split(':')[1]
      );

    if (
      !req.guild.settings.get('selfRolesChannel') ||
      !req.guild.settings.get('selfRolesMessage')
    )
      return res.status(400).json({
        code: 400,
        error:
          "'selfRolesChannel' and/or 'selfRolesMessage' are not set in guild settings",
      });

    if (!role)
      return res.status(400).json({
        code: 400,
        error: 'No role with given ID was found',
      });

    const channel = req.guild.channels.get(
      req.guild.settings.get('selfRolesChannel')
    );

    if (!(channel instanceof TextChannel))
      return res.status(400).json({
        code: 400,
        error: "'selfRolesChannel' is not a valid text channel",
      });

    const msg = await channel.messages.fetch(
      req.guild.settings.get('selfRolesMessage')
    );

    if (!msg || !channel)
      return res.status(400).json({
        code: 400,
        error: "'selfRolesChannel' or 'selfRolesMessage' is invalid",
      });

    msg.react(emoji);

    await new SelfRole({
      guildID: req.guild,
      messageID: req.guild.settings.get('selfRolesMessage'),
      emojiName: emoji,
      roleName: role.name,
    }).save();

    const selfRoles = await SelfRole.find({ guildID: req.guild.id }).exec();

    return res.json({
      selfRoles,
    });
  });

  // Delete a Self Role for a guild
  // --------
  // Body Params:
  // role - ID of role
  //! Untested
  api.delete('/guilds/:id/selfroles', async (req, res) => {
    if (!req.body.role)
      return res.status(400).json({ code: 400, error: "Role wan't provided" });

    const selfRole = await SelfRole.findOne({
      guildID: req.guild.id,
      roleName: req.params.roleName,
    }).exec();

    if (!selfRole)
      return res.status(400).json({
        code: 400,
        error: "Self role with provided role wasn't found",
      });

    await SelfRole.remove({
      guildID: req.guild.id,
      roleName: req.params.roleName,
    }).exec();

    const selfRoles = await SelfRole.find({ guildID: req.guild.id }).exec();

    return res.json({
      selfRoles,
    });
  });

  // ? Routes to Add:
  // - GET /guilds/:id/levelperks => Return all the level up perks
  // - POST /guilds/:id/levelperks => Create a new level up perk
  // - DELETE /guilds/:id/levelperks => Delete level up perk
  // - GET /guilds/:id/logs => Return logs
  // - GET /guilds/:id/leaderboards => Returns Level & Reputation Leaderboards
  // - GET /guilds/:id/notifications => Return notifications such as reports, Updates, etc
  // - GET /users/:id => Return info about the user (must be the logged in user)
  // - GET /users/:id/token => Returns token for the logged in user alongside QR Code

  app.use('/api/v1', api);
};
