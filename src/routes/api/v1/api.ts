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
import { IGuildModel } from '../../../models/Guild';
import _ from 'lodash';
import { ILogModel } from '../../../models/Log';
import { IProfileModel } from '../../../models/Profile';

// Init
const api = express.Router();
const SelfRole = <ISelfRoleModel>model('SelfRole');
const Guild = <IGuildModel>model('Guild');
const Profile = <IProfileModel>model('Profile');
const Log = <ILogModel>model('Log');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

// Globals
const version = 1.0;

module.exports = (app: Application, client: KlasaClient) => {
  // Middlewares
  api.use(async (req: Request, res: Response, next: NextFunction) => {
    if (botEnv === 'production')
      return res
        .status(501)
        .json({ code: 501, error: 'API not ready for production' });
    next();
  });

  api.use(
    ['/guilds*', '/me*'],
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

      // Fetching Tier
      const tier = await redisClient.hgetAsync('guild_tiers', guild.id);

      req['guild'] = guild;
      req['tier'] = tier;

      next();
    }
  );

  api.use(
    ['/guilds/:id/members/:memberID*'],
    async (req: Request, res: Response, next: NextFunction) => {
      // Fetching Member
      const member = req.guild.members.get(req.params.memberID);

      if (!member)
        return res.status(404).json({ code: 404, error: 'No member found' });

      req['member'] = member;
      next();
    }
  );

  api.use(
    ['/guilds/:id/channels/:channelID*'],
    async (req: Request, res: Response, next: NextFunction) => {
      // Fetching Channel
      const channel = req.guild.channels.get(req.params.channelID);

      if (!channel)
        return res.status(404).json({ code: 404, error: 'No channel found' });

      req['channel'] = channel;
      next();
    }
  );

  api.use(
    ['/guilds/:id/roles/:roleID*'],
    async (req: Request, res: Response, next: NextFunction) => {
      // Fetching Role
      const role = req.guild.roles.get(req.params.roleID);

      if (!role)
        return res.status(404).json({ code: 404, error: 'No role found' });

      req['role'] = role;
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
    req.guild['tier'] = req.tier;
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
  // joinCycle - number of days to show joinRate for (int)
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
  api.get('/guilds/:id/members/:memberID', async (req, res) => {
    const profile = await Profile.findOne({
      memberID: req.params.memberID,
    }).exec();

    // Filtering Private Profile Data
    profile.mutedIn = undefined;
    const member = Object.assign({}, req.member);
    member.user = undefined;

    _.remove(profile.badges, b => b.guildID !== req.guild.id);
    _.remove(profile.reputation, r => r.guildID !== req.guild.id);
    _.remove(profile.level, l => l.guildID !== req.guild.id);

    return res.json({
      member: { ...member, profile },
    });
  });

  // Kick a guild Member
  // -----
  // Body Params:
  // reason
  api.post('/guilds/:id/members/:memberID/kick', async (req, res) => {
    const reason = req.body.reason || 'Kicked using API';

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
  // -----
  // Body Params:
  // reason
  api.post('/guilds/:id/members/:memberID/ban', async (req, res) => {
    const reason = req.body.reason || 'Banned using API';

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

  // Fetch badges of a member
  api.get('/guilds/:id/members/:memberID/badges', async (req, res) => {
    const profile = await Profile.findOne({
      memberID: req.params.memberID,
    }).exec();

    const badges = profile.badges.filter(b => b.guildID === req.guild.id)[0];

    return res.json({
      activeBadge: badges.activeBadge,
      badges: badges.badges,
    });
  });

  // Give a badge to a guild member
  // ------
  // Body Params:
  // badge - badge to give
  api.post('/guilds/:id/members/:memberID/badges', async (req, res) => {
    if (!req.body.badge || typeof req.body.badge !== 'string')
      return res.status(400).json({
        code: 400,
        error: "'badge' not provided or the format is incorrect",
      });

    const profile = await Profile.findOne({
      memberID: req.params.memberID,
    }).exec();

    req.member.user.giveBadge(req.body.badge, req.guild.id);
    const badges = profile.badges.filter(b => b.guildID === req.guild.id)[0];

    return res.json({
      activeBadge: badges.activeBadge,
      badges: badges.badges,
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
  api.post('/guilds/:id/settings', async (req, res) => {
    if (!req.body.key || typeof req.body.key !== 'string')
      return res.status(400).json({
        code: 400,
        error:
          "'Key' or 'Value' were either not provided or the format is incorrect",
      });

    await req.guild.settings.update(req.body.key, req.body.value);

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
  api.post('/guilds/:id/selfroles', async (req, res) => {
    if (
      !req.body.role ||
      !req.body.emoji ||
      typeof req.body.role !== 'string' ||
      typeof req.body.emoji !== 'string'
    )
      return res.status(400).json({
        code: 400,
        error:
          "'role' or 'emoji' were either not provided or the format is incorrect",
      });

    const role = req.guild.roles.get(req.body.role);
    let emoji = req.body.emoji;

    if (client.emojis.find(e => e.name === req.body.emoji.split(':')[1]))
      emoji = client.emojis.find(e => e.name === req.body.emoji.split(':')[1]);

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
      guildID: req.guild.id,
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
  api.delete('/guilds/:id/selfroles', async (req, res) => {
    if (!req.body.role || typeof req.body.role !== 'string')
      return res.status(400).json({
        code: 400,
        error: "'role' was either not provided or the format is incorrect",
      });

    const role = req.guild.roles.get(req.body.role);

    if (!role)
      return res.status(400).json({
        code: 400,
        error: "Role wasn't found",
      });

    const selfRole = await SelfRole.findOne({
      guildID: req.guild.id,
      roleName: role.name,
    }).exec();

    if (!selfRole)
      return res.status(400).json({
        code: 400,
        error: "Self role with provided role wasn't found",
      });

    await SelfRole.remove({
      guildID: req.guild.id,
      roleName: role.name,
    }).exec();

    const selfRoles = await SelfRole.find({ guildID: req.guild.id }).exec();

    return res.json({
      selfRoles,
    });
  });

  // Fetch level perks of a guild
  api.get('/guilds/:id/levelperks', async (req, res) => {
    if (req.tier === 'free')
      return res
        .status(400)
        .json({ code: 400, error: 'Not available for free tier' });

    const guild = await Guild.findOne({ guildID: req.guild.id }).exec();

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  // Create a new level up perk
  // --------
  // Body Params:
  // level - level # to create perk for (int)
  // key - Type of perk to create (badge|rep|role)
  // value - Value for this perk
  api.post('/guilds/:id/levelperks', async (req, res) => {
    if (req.tier === 'free')
      return res
        .status(400)
        .json({ code: 400, error: 'Not available for free tier' });

    const guild = await Guild.findOne({ guildID: req.guild.id }).exec();

    if (!req.body.level || !req.body.key || !req.body.value)
      return res.status(400).json({
        code: 400,
        error: "'level', 'key' or 'value' weren't provided",
      });

    if (
      typeof req.body.level !== 'number' ||
      req.body.level < 1 ||
      req.body.level > 100 ||
      !_.includes(['badge', 'rep', 'role'], req.body.key)
    )
      return res.status(400).json({
        code: 400,
        error: "'level', 'key' or 'value' were provided in incorrect format",
      });

    await guild.addLevelPerk(req.body.level, req.body.key, req.body.value);

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  // Delete a level up perk
  // --------
  // Body Params:
  // level - level # to create perk for (int)
  api.delete('/guilds/:id/levelperks', async (req, res) => {
    if (req.tier === 'free')
      return res
        .status(400)
        .json({ code: 400, error: 'Not available for free tier' });

    const guild = await Guild.findOne({ guildID: req.guild.id }).exec();

    if (
      !req.body.level ||
      typeof req.body.level !== 'number' ||
      req.body.level < 1 ||
      req.body.level > 100
    )
      return res.status(400).json({
        code: 400,
        error: "'level' wasn't provided or the format was incorrect",
      });

    await guild.removeLevelPerk(parseInt(req.body.level));

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  // Fetch Logs
  // -------
  // Query Params:
  // offset
  // limit
  api.get('/guilds/:id/logs', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const logs = await Log.find({ guildID: req.guild.id })
      .sort({ dateTime: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return res.json({ logs });
  });

  // Fetch Level & Reputation Leaderboards
  api.get('/guilds/:id/leaderboards', async (req, res) => {
    const levelLeaderboards = [];
    const repLeaderboards = [];

    const members = await Profile.find({
      level: { $elemMatch: { guildID: req.guild.id } },
    });

    if (req.tier !== 'free') {
      members.sort((a, b) => {
        const indexA = a.level.findIndex(r => r.guildID === req.guild.id);
        const indexB = b.level.findIndex(r => r.guildID === req.guild.id);
        return a.level[indexA].level > b.level[indexB].level ? -1 : 1;
      });

      const levelMembers = members.slice(0, 30);

      levelMembers.forEach(m => {
        if (client.users.get(m.memberID)) levelLeaderboards.push(m.memberID);
      });
    }

    members.sort((a, b) => {
      const indexA = a.reputation.findIndex(r => r.guildID === req.guild.id);
      const indexB = b.reputation.findIndex(r => r.guildID === req.guild.id);
      return a.reputation[indexA].rep > b.reputation[indexB].rep ? -1 : 1;
    });

    const repMembers = members.slice(0, 30);

    repMembers.forEach(m => {
      if (client.users.get(m.memberID)) repLeaderboards.push(m.memberID);
    });

    return res.json({
      levelLeaderboards:
        levelLeaderboards.length > 0
          ? levelLeaderboards
          : {
              code: 400,
              error: 'Not available for free tier',
            },
      repLeaderboards,
    });
  });

  // Fetch IDs of all the channels in a guild
  api.get('/guilds/:id/channels', (req, res) => {
    return res.json({ channels: req.guild.channels.array().map(c => c.id) });
  });

  // Fetch a channel in a guild
  api.get('/guilds/:id/channels/:channelID', (req, res) => {
    return res.json({ channel: req.guild.channels.get(req.params.channelID) });
  });

  // Fetch IDs of all the roles in a guild
  api.get('/guilds/:id/roles', (req, res) => {
    return res.json({ roles: req.guild.roles.array().map(r => r.id) });
  });

  // Fetch a role in a guild
  api.get('/guilds/:id/roles/:roleID', (req, res) => {
    return res.json({ role: req.guild.roles.get(req.params.roleID) });
  });

  // Fetch info about the logged in user
  api.get('/me', (req, res) => {
    return res.json({ me: req.user });
  });

  // Fetch token of the logged in user
  api.get('/me/token', (req, res) => {
    return res.json({ token: req.headers.authorization });
  });

  // ? Routes to Add:

  app.use('/api/v1', api);
};
