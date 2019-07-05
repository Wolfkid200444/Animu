//=====================
//DEPENDENCIES
//=====================
const { Client } = require('klasa');
const keys = require('./config/keys');
const mongoose = require('mongoose');
//=====================

//=====================
//SCHEMAS
//=====================
//-> Client Schema
Client.defaultClientSchema.add('aldoviaSeniorMods', 'User', { array: true });
//=====================

//=====================
//INIT
//=====================
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
        client.settings.aldoviaSeniorMods = [
          '477853785436192769' //Kitty
        ];
        return 'Bot ready';
      }
    }).login(keys.discordBotToken);
  });
//=====================
