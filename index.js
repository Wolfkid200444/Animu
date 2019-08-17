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
Client.defaultGuildSchema.add('mutedRole', 'role');

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
  .then(async () => {
    //->Creating models
    require('./models/Reaction');
    require('./models/Action');
    require('./models/Profile');
    require('./models/Inventory');
    require('./models/Item');
    require('./models/Partner');
    require('./models/Pet');
    require('./models/Config');

    //-> Klasa Client
    const client = await new Client({
      fetchAllMembers: false,
      prefix: '-',
      commandEditing: true,
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
      readyMessage: () => 'Bot ready'
    });

    await client.login(keys.discordBotToken);

    console.log('hmmm');

    //-> Adding client-dependent routes
    require('./routes/webhooks')(app, client);
  });
//=====================

//=====================
//Listening
//=====================
if (process.env.NODE_ENV === 'production') app.listen(process.env.PORT || 3000);
//=====================
