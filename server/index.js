//==========================
//DEPENDENCIES
//==========================
const express = require('express');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const redis = require('redis').createClient();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const MongoDBProvider = require('commando-provider-mongo');
const { CommandoClient } = require('discord.js-commando');
// const redisStore = require('connect-redis')(session);
const path = require('path');
const keys = require('./config/keys');
//==========================

//==========================
//CONSTANTS
//==========================
const client = new CommandoClient({
    commandPrefix: '-',
    owner: [
      '338334949331697664' //Light Yagami
    ],
    invite: 'https://discord.gg/JGsgBsN',
    disableEveryone: true
  }),
  app = express(),
  PORT = process.env.PORT || 5000;
//==========================

//==========================
//EXPRESS
//==========================
// app.use(
//   session({
//     secret: keys.sessionSecret,
//     store: new redisStore({
//       host: keys.redisHost,
//       port: keys.redisPort,
//       client: redis,
//       ttl: 260
//     }),
//     saveUninitialized: true,
//     resave: false
//   })
// );
app.use(bodyParser.json());
//==========================

//==========================
//MONGOOSE
//==========================
mongoose
  .connect(keys.mongoConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Database Status: Online');
    //->Creating models
    require('./models/Reaction');

    //==========================
    //DISCORD
    //==========================
    //->Settings provider
    client
      .setProvider(
        MongoClient.connect(keys.mongoConnectionString, {
          useNewUrlParser: true
        }).then(client => new MongoDBProvider(client, 'abot'))
      )
      .catch(console.error);
    //->Registering commands
    client.registry
      .registerDefaultTypes()
      .registerGroups([
        ['profile', 'Profile Commands'],
        ['shop', 'Shop Commands'],
        ['inventory', 'Inventory Commands'],
        ['fun', 'Fun Commands'],
        ['moderation', 'Moderation Commands (For Moderators)'],
        ['advancedmod', 'Advanced Moderation Commands (For Senior Moderators)'],
        ['stats', 'Status Commands']
      ])
      .registerDefaultGroups()
      .registerDefaultCommands()
      .registerCommandsIn(path.join(__dirname, 'commands'));

    //->When Ready
    client.on('ready', () =>
      client.user.setActivity('over Alvonia | -help', { type: 'WATCHING' })
    );
    //==========================
  });
//==========================

//==========================
//ROUTES
//==========================
require('./routes/webhooks')(app, client);
//==========================

//==========================
//Listening
//==========================
client.login(keys.discordBotToken).catch(err => console.log(err));
app.listen(PORT, () => console.log('Website Status: Online'));
//==========================
