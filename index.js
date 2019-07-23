//=====================
//DEPENDENCIES
//=====================
const { Client } = require('klasa');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
//=====================

//=====================
//SCHEMAS
//=====================
//-> Client Schema
Client.defaultClientSchema.add('aldoviaSeniorMods', 'User', { array: true });
Client.defaultClientSchema.add('aldoviaInviteLink', 'String');
Client.defaultClientSchema.add('aldoviaDescription', 'String');

//-> Guild Schema
Client.defaultGuildSchema.add('joinRole', 'role');

//-> User Schema
Client.defaultUserSchema.add('TODOs', 'any', { array: true });
//=====================

//=====================
//INIT
//=====================
//-> Express App
const app = express();
app.use(bodyParser.json());
require('./routes/root')(app);

//-> Klasa Client
Client.defaultPermissionLevels
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
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database Status: Online');
    //->Creating models
    require('./models/Reaction');
    require('./models/Action');
    require('./models/Profile');
    require('./models/Inventory');
    require('./models/Item');
    require('./models/Partner');
    require('./models/Config');

    //-> Klasa Client
    new Client({
      fetchAllMembers: false,
      prefix: '-',
      commandEditing: true,
      typing: true,
      noPrefixDM: true,
      providers: {
        default: 'mongodb',
        mongodb: {
          connectionString: keys.mongoConnectionString
        }
      },
      owners: [
        '556455046217203752', //Lily
        '338334949331697664', //Light Yagami
        '510715931572305920' //Misaki
      ],
      readyMessage: client => {
        client.user.setActivity('over Aldovia Network', { type: 'WATCHING' });
        client.settings.aldoviaInviteLink = 'https://discord.gg/JGsgBsN';
        client.settings.aldoviaDescription =
          'An anime server made for weebs by weebs';
        client.settings.aldoviaSeniorMods = [
          '477853785436192769', //Kitty
          '555394471320092684' //Saeba
        ];

        //-> Adding client-dependent routes
        require('./routes/webhooks')(app, client);

        //-> Scheduling Tasks
        client.schedule.create('lotto', '0 0 * * *');

        return 'Bot ready';
      }
    }).login(keys.discordBotToken);
  });
//=====================

//=====================
//Listening
//=====================
if (process.env.NODE_ENV === 'production') app.listen(process.env.PORT || 3000);
//=====================
