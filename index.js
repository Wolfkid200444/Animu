//=====================
//DEPENDENCIES
//=====================
const { Client } = require('klasa');
const { Client: Lavaqueue } = require('lavaqueue');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const bluebird = require('bluebird');
//=====================

//=====================
//Initialization
//=====================
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();
//=====================

//=====================
//Animu Client
//=====================
class AnimuClient extends Client {
  constructor(...args) {
    super(...args);

    this.lVoice = null;
  }
}
//=====================

//=====================
//SCHEMAS
//=====================
//-> AnimuClient Schema
AnimuClient.defaultClientSchema.add('aldoviaSeniorMods', 'User', {
  array: true,
});
AnimuClient.defaultClientSchema.add('aldoviaInviteLink', 'String');
AnimuClient.defaultClientSchema.add('aldoviaDescription', 'String');

//-> Guild Schema
AnimuClient.defaultGuildSchema.add('defaultVolume', 'number', {
  default: 50,
  min: 1,
  max: 100,
});
AnimuClient.defaultGuildSchema.add('expRate', 'number', {
  default: 1,
  min: 0.1,
  max: 10,
});
AnimuClient.defaultGuildSchema.add('expTime', 'number', {
  default: 3,
  min: 1,
  max: 60,
});
AnimuClient.defaultGuildSchema.add('enableLevels', 'boolean', {
  default: true,
});
AnimuClient.defaultGuildSchema.add('djRole', 'role');
AnimuClient.defaultGuildSchema.add('joinRole', 'role');
AnimuClient.defaultGuildSchema.add('verifiedRole', 'role');
AnimuClient.defaultGuildSchema.add('mutedRole', 'role');
AnimuClient.defaultGuildSchema.add('selfRolesChannel', 'textchannel');
AnimuClient.defaultGuildSchema.add('selfRolesMessage', 'string');
AnimuClient.defaultGuildSchema.add('startingRep', 'number', { default: 50 });
AnimuClient.defaultGuildSchema.add('banOnLowRep', 'boolean');
AnimuClient.defaultGuildSchema.add('ignoreRepRoles', 'role', { array: true });
AnimuClient.defaultGuildSchema.add('ignoreLevelRoles', 'role', { array: true });
AnimuClient.defaultGuildSchema.add('allowExpBottles', 'boolean', {
  default: true,
});
AnimuClient.defaultGuildSchema.add('welcomeChannel', 'channel');
AnimuClient.defaultGuildSchema.add('welcomeMessage', 'string');
AnimuClient.defaultGuildSchema.add('welcomeImageURL', 'string');
AnimuClient.defaultGuildSchema.add('deleteMessagesChannels', 'textchannel', {
  array: true,
});
AnimuClient.defaultGuildSchema.add('ignoreExpChannels', 'channel', {
  array: true,
});
AnimuClient.defaultGuildSchema.add('deleteToxicMessages', 'bool');
AnimuClient.defaultGuildSchema.add('toxicityFilters', folder => {
  folder.add('toxicity', 'bool');
  folder.add('severeToxicity', 'bool');
  folder.add('insult', 'bool');
  folder.add('profanity', 'bool');
  folder.add('identityAttack', 'bool');
  folder.add('sexuallyExplicit', 'bool');
  folder.add('flirtation', 'bool');
  folder.add('threat', 'bool');
});
AnimuClient.defaultGuildSchema.add('logChannels', folder => {
  folder.add('deletedMessages', 'textchannel');
  folder.add('reports', 'textchannel');
});
AnimuClient.defaultGuildSchema.add('verifiedMemberPerks', folder =>
  folder.add('changeBanner', 'boolean')
);

//-> User Schema
AnimuClient.defaultUserSchema.add('TODOs', 'any', { array: true });
//=====================

//=====================
//INIT
//=====================
//-> Express App
const app = express();
app.use(bodyParser.json());
require('./routes/root')(app);

//-> Klasa AnimuClient
AnimuClient.defaultPermissionLevels
  .add(
    5,
    ({ guild, member }) => guild && member.permissions.has('MANAGE_ROLES'),
    { fetch: true }
  )
  .add(8, ({ client, author }) =>
    client.settings.aldoviaSeniorMods.includes(author.id)
  );
//-> Mongoose
mongoose
  .connect(keys.mongoConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(async () => {
    //->Creating models
    require('./models/Reaction');
    require('./models/Action');
    require('./models/Inventory');
    require('./models/Profile');
    require('./models/Item');
    require('./models/Partner');
    require('./models/Pet');
    require('./models/SelfRole');
    require('./models/Log');
    require('./models/Guild');
    require('./models/BankAccount');
    require('./models/Config');

    //-> Klasa AnimuClient
    const client = new AnimuClient({
      fetchAllMembers: false,
      prefix: '-',
      commandEditing: true,
      noPrefixDM: true,
      providers: {
        default: 'mongodb',
        mongodb: {
          connectionString: keys.mongoConnectionString,
        },
      },
      owners: [
        '556455046217203752', //Lily
        '338334949331697664', //Light Yagami
        '510715931572305920', //Misaki
      ],
      partials: ['MESSAGE'],
      readyMessage: () => 'Bot ready',
    });

    await client.login(keys.discordBotToken);

    //-> Adding client-dependent routes
    require('./routes/webhooks')(app, client);
    require('./routes/api')(app, client);

    client.lVoice = new Lavaqueue({
      password: keys.lavalinkPassword,
      userID: client.user.id,
      hosts: {
        rest: 'http://localhost:2333',
        ws: 'http://localhost:2333',
        redis: 'localhost:6379',
      },
      send(guildID, packet) {
        if (client.guilds.has(guildID))
          return client.guilds.get(guildID).shard.send(packet);
        throw new Error('attempted to send a packet on the wrong shard');
      },
    });

    client.on('raw', pk => {
      if (pk.t === 'VOICE_STATE_UPDATE') client.lVoice.voiceStateUpdate(pk.d);
      if (pk.t === 'VOICE_SERVER_UPDATE') client.lVoice.voiceServerUpdate(pk.d);
    });

    client.lVoice.on('event', async d => {
      if (d.type === 'TrackEndEvent') {
        redisClient.delAsync(`skip_votes:${d.guildId}`);

        const looping = await redisClient.sismemberAsync(
          'loop_guilds',
          d.guildId
        );

        if (looping) {
          await client.lVoice.queues.get(d.guildId).add([d.track]);
        }

        const allTracks = await client.lVoice.queues.get(d.guildId).tracks();

        console.log(allTracks);

        if (!looping && allTracks.length === 0)
          await client.lVoice.queues.get(d.guildId).player.leave();
      }
    });
  });
//=====================

//=====================
//Listening
//=====================
app.listen(process.env.PORT || 8080);
//=====================
