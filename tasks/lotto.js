const { Task } = require('klasa');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');

//Init
const Inventory = mongoose.model('Inventory');
const Config = mongoose.model('Config');

module.exports = class extends Task {
  async run() {
    this.client.guilds
      .get('556442896719544320')
      .channels.get('586293473788035092')
      .send('GIVING LOTTO');
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

    this.client.guilds
      .get('556442896719544320')
      .channels.get('591319515674181662')
      .send(
        new MessageEmbed()
          .setTitle(
            `${
              this.client.guilds
                .get('556442896719544320')
                .members.get(winnerInventory.memberID).displayName
            } won today's lottery!`
          )
          .setDescription(
            `The total prize money won by **${
              this.client.guilds
                .get('556442896719544320')
                .members.get(winnerInventory.memberID).displayName
            }** is **${reward}**`
          )
          .setColor('#2196f3')
      );
  }
***REMOVED***
