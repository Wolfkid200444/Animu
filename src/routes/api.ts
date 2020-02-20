import express, { Application } from 'express';
import redis from 'redis';
import bluebird from 'bluebird';
import moment from 'moment';
import { model } from 'mongoose';
import _ from 'lodash';
import { IProfileModel } from '../models/Profile';
import { ILogModel } from '../models/Log';
import { IGuildModel } from '../models/Guild';
import { IItemModel } from '../models/Item';
import { ISelfRoleModel } from '../models/SelfRole';
import { TextChannel } from 'discord.js';
import { IInventoryModel } from '../models/Inventory';
import { animuAPIKey } from '../config/keys';
import { KlasaClient } from 'klasa';

const api = express.Router();
const Profile = <IProfileModel>model('Profile');
const Inventory = <IInventoryModel>model('Inventory');
const Log = <ILogModel>model('Log');
const Guild = <IGuildModel>model('Guild');
const SelfRole = <ISelfRoleModel>model('SelfRole');
const Item = <IItemModel>model('Item');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

// Versions
const minAndroidVersion = 0.6;
const currentAndroidVersion = 0.6;

module.exports = (app: Application, client: KlasaClient) => {
  api.get('/', (req, res) => {
    res.json({ ApiStatus: 'online' });
  });

  api.get('/version', async (req, res) => {
    return res.json({
      minAndroidVersion,
      currentAndroidVersion,
    });
  });

  api.post('/hook', async (req, res) => {
    if (req.headers.authorization !== animuAPIKey)
      return res.json({ error: 'Invalid Animu API Key' });
    if (req.body.type === 'upvote') {
      const inv = await Inventory.findOne({ memberID: req.body.user });

      if (inv) inv.addCoins(15);
    }
    return res.json({ success: 'Upvote Successfully recieved' });
  });

  api.get('/auth', async (req, res) => {
    if (!req.query.token) return res.json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      guildID: guild.id,
    });
  });

  api.get('/guild', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      guild: {
        id: guild.id,
        ownerID: guild.owner.id,
        name: guild.name,
        memberCount: guild.memberCount,
        onlineMemberCount: guild.members.filter(
          m =>
            m.presence.status === 'online' ||
            m.presence.status === 'idle' ||
            m.presence.status === 'dnd'
        ).size,
        nitroBoostersCount: guild.premiumSubscriptionCount,
        nitroLevel: guild.premiumTier,
        tier: await redisClient.hgetAsync('guild_tiers', guild.id),
      },
    });
  });

  api.get('/members/:id', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const member = guild.members.get(req.params.id);

    const profile = await Profile.findOne({ memberID: member.id });
    const wallpaper = await Item.findOne({ name: profile.profileWallpaper });

    let isOwner = false;

    for (const owner of client.owners)
      if (owner.id === member.id) isOwner = true;

    const badges = profile.badges.find(
      guildBadges => guildBadges.guildID === guildID
    );

    const level = profile.level.find(g => g.guildID === guildID);
    const rep = profile.reputation.find(g => g.guildID === guildID);

    return res.json({
      member: {
        id: member.id,
        username: member.user.username,
        tag: member.user.tag,
        displayName: member.displayName,
        avatarURL: member.user.displayAvatarURL({ size: 512 }),
        description: profile.description,
        favoriteAnime: profile.favoriteAnime,
        profileColor: profile.profileColor,
        profileWallpaperURL: wallpaper !== null ? wallpaper.imageURL : '',
        marriedTo: profile.marriedTo,
        badges: {
          activeBadge: isOwner
            ? '👑 Bot Owner 👑'
            : _.includes(client.settings.get('animuStaff'), member.id)
            ? '🛡 Bot Staff'
            : badges !== null && badges !== undefined
            ? badges.activeBadge
            : '',
          badges: badges !== null && badges !== undefined ? badges.badges : '',
        },
        level: {
          level: level !== null && level !== undefined ? level.level : 0,
          exp: level !== null && level !== undefined ? level.exp : 0,
        },
        reputation: rep !== null && rep !== undefined ? rep.rep : 0,
      },
    });
  });

  api.post('/members/:id/kick', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const member = guild.members.get(req.params.id);

    member.kick(req.body.reason);

    return res.json({
      memberKicked: member.id,
    });
  });

  api.post('/members/:id/ban', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const member = guild.members.get(req.params.id);

    member.ban({ reason: req.body.reason });

    return res.json({
      memberBanned: member.id,
    });
  });

  api.post('/members/:id/badges', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);
    const member = guild.members.get(req.params.id);

    member.user.giveBadge(req.body.badgeName, guildID);

    return res.json({
      result: 'success',
    });
  });

  api.get('/channels', async (req, res) => {
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
          return { id: c.id, name: c.name };
        }),
    });
  });

  api.get('/roles', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    return res.json({
      roles: guild.roles.map(r => {
        return { id: r.id, name: r.name };
      }),
    });
  });

  api.get('/growth', async (req, res) => {
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

  api.get('/joined', async (req, res) => {
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

  api.get('/logs', async (req, res) => {
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

  api.get('/leaderboards/levels', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);
    const guildTier = await redisClient.hgetAsync('guild_tiers', guildID);

    if (guildTier === 'free')
      return res
        .status(403)
        .json({ err: 'This API route is not available for free users' });

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
      if (client.users.get(m.memberID)) members.push(m.memberID);
    });

    return res.json({
      members,
    });
  });

  api.get('/leaderboards/rep', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guild = client.guilds.get(guildID);

    const membersRaw = await Profile.find({
      reputation: { $elemMatch: { guildID: guild.id } },
    });

    membersRaw.sort((a, b) => {
      const indexA = a.reputation.findIndex(r => r.guildID === guild.id);
      const indexB = b.reputation.findIndex(r => r.guildID === guild.id);
      return a.reputation[indexA].rep > b.reputation[indexB].rep ? -1 : 1;
    });

    const membersRaw2 = membersRaw.slice(0, 30);

    const members = [];

    membersRaw2.forEach(m => {
      if (client.users.get(m.memberID)) members.push(m.memberID);
    });

    return res.json({
      members,
    });
  });

  api.get('/selfroles', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const selfRoles = await SelfRole.find({ guildID: guildID }).exec();

    return res.json({
      selfRoles: selfRoles,
    });
  });

  api.post('/selfroles', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const guildC = client.guilds.get(guildID);

    if (!req.body.roleName) return res.json({ err: 'No role provided' });
    if (!req.body.emojiName) return res.json({ err: 'No emji provided' });

    const role = guildC.roles.find(r => r.name === req.body.roleName);
    let emoji = req.body.emojiName;
    if (client.emojis.find(e => e.name === req.body.emojiName.split(':')[1]))
      emoji = client.emojis.find(
        e => e.name === req.body.emojiName.split(':')[1]
      );

    if (
      !guildC.settings.get('selfRolesChannel') ||
      !guildC.settings.get('selfRolesMessage')
    )
      return res.json({ err: 'No self roles channel/msg set' });

    if (!role) return res.json({ err: 'No emoji/role found' });

    const rCh = guildC.channels.get(guildC.settings.get('selfRolesChannel'));

    if (!(rCh instanceof TextChannel))
      return res.json({ err: 'Channel provided is not a valid text channel' });

    const rMsg = await rCh.messages.fetch(
      guildC.settings.get('selfRolesMessage')
    );

    if (!rMsg || !rCh) return res.json({ err: 'Invalid message ID/Channel' });

    rMsg.react(emoji);

    await new SelfRole({
      guildID: guildID,
      messageID: guildC.settings.get('selfRolesMessage'),
      emojiName: emoji,
      roleName: req.body.roleName,
    }).save();

    return res.json({
      selfRoles: await SelfRole.find({ guildID: guildID }).exec(),
    });
  });

  api.delete('/selfroles/:roleName', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);

    const selfRole = await SelfRole.findOne({
      guildID: guildID,
      roleName: req.params.roleName,
    }).exec();

    if (!selfRole)
      return res
        .status(404)
        .json({ err: 'Self role with provided roleName not found' });

    await SelfRole.remove({ guildID, roleName: req.params.roleName }).exec();

    return res.json({
      selfRoles: await SelfRole.find({ guildID: guildID }).exec(),
    });
  });

  api.get('/levelperks', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);
    const guildTier = await redisClient.hgetAsync('guild_tiers', guildID);

    if (guildTier === 'free')
      return res
        .status(403)
        .json({ err: 'This API route is not available for free users' });

    const guild = await Guild.findOne({ guildID: guildID }).exec();

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  api.post('/levelperks', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);
    const guildTier = await redisClient.hgetAsync('guild_tiers', guildID);

    if (guildTier === 'free')
      return res
        .status(403)
        .json({ err: 'This API route is not available for free users' });

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

  api.delete('/levelperks/:level', async (req, res) => {
    if (!req.query.token)
      return res.status(401).json({ err: 'Token not provided' });

    if (!(await redisClient.hexistsAsync('auth_tokens', req.query.token)))
      return res.status(401).json({ err: 'Invalid token' });

    const guildID = await redisClient.hgetAsync('auth_tokens', req.query.token);
    const guildTier = await redisClient.hgetAsync('guild_tiers', guildID);

    if (guildTier === 'free')
      return res
        .status(403)
        .json({ err: 'This API route is not available for free users' });

    const guild = await Guild.findOne({ guildID: guildID }).exec();

    await guild.removeLevelPerk(parseInt(req.params.level));

    return res.json({
      levelPerks: guild.levelPerks,
    });
  });

  api.get('/settings', async (req, res) => {
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

  api.post('/settings', async (req, res) => {
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

    if (req.body.key.includes('.')) {
      const keys = req.body.key.split('.');
      guild.settings[keys[0]][keys[1]] = req.body.value;
    } else guild.settings[req.body.key] = req.body.value;

    return res.json({
      settings: guild.settings,
    });
  });

  app.use('/api', api);
};
