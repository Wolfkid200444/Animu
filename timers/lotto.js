const schedule = require('node-schedule');
const mongoose = require('mongoose');
const { RichEmbed } = require('discord.js');

//Init
const Inventory = mongoose.model('Inventory');
const Config = mongoose.model('Config');

//Main
module.exports = client => {
  schedule.scheduleJob('0 0 0 * *', async () => {
    console.log('GIVING LOTTO');
    const totalLottos = await Config.findOne({ key: 'totalLottos' }).exec();

    if (totalLottos < 1) return;

    const winningNumber = Math.floor(Math.random() * (totalLottos + 1));

    const winnerInventory = await Inventory.findOne({
      lottos: winningNumber
    }).exec();

    const reward = totalLottos * 10;

    winnerInventory.coins += reward;
    totalLottos.value = 0;

    totalLottos.markModified('value');

    await winnerInventory.save();
    await totalLottos.save();

    await Inventory.updateMany({}, { lottos: [] });

    client.guilds
      .get('556442896719544320')
      .channels.get('591319515674181662')
      .send(
        new RichEmbed()
          .setTitle(
            `${
              client.guilds
                .get('556442896719544320')
                .members.get(winnerInventory.memberID).displayName
            } won today's lottery!`
          )
          .setDescription(
            `The total prize money won by **${
              client.guilds
                .get('556442896719544320')
                .members.get(winnerInventory.memberID).displayName
            }** is **${reward}**`
          )
          .setColor('#2196f3')
      );
  });
***REMOVED***
