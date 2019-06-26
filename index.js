//==========================
//DEPENDENCIES
//==========================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const MongoDBProvider = require('commando-provider-mongo');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const keys = require('./config/keys');
//==========================

//==========================
//CONSTANTS
//==========================
const client = new CommandoClient({
    commandPrefix: '-',
    owner: [
      '338334949331697664', //Light Yagami
      '510715931572305920' //Misaki
    ],
    invite: 'https://discord.gg/JGsgBsN',
    disableEveryone: true
  }),
  app = express(),
  PORT = process.env.PORT || 3000;
//==========================

//==========================
//EXPRESS
//==========================
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
    require('./models/Action');
    require('./models/Profile');
    require('./models/Inventory');
    require('./models/Item');
    require('./models/Config');

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
        ['gambling', 'Gambling & Lotto Commands'],
        ['fun', 'Fun Commands'],
        ['games', 'Games'],
        ['moderation', 'Moderation Commands (For Moderators)'],
        ['advancedmod', 'Advanced Moderation Commands (For Senior Moderators)'],
        ['stats', 'Status Commands']
      ])
      .registerDefaultGroups()
      .registerDefaultCommands()
      .registerCommandsIn(path.join(__dirname, 'commands'));

    //->When Ready
    client.on('ready', () => {
      client.user.setActivity('over Aldovia | -help', { type: 'WATCHING' });

      //==========================
      //TIMERS
      //==========================
      require('./timers/lotto')(client);
      //==========================

      //==========================
      //EVENTS
      //==========================
      require('./events/guildMemberAdd')(client);
      require('./events/message')(client);
      //==========================

      //==========================
      //ROUTES
      //==========================
      require('./routes/webhooks')(app, client);
      //==========================
    });
    //==========================
  });
//==========================

//==========================
//Listening
//==========================
client
  .login(keys.discordBotToken)
  .then(() => console.log('Bot Status: Online'))
  .catch(err => console.log(err));
app.listen(PORT, () => console.log('Web Server Status: Online'));
//==========================
