const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Inventory = mongoose.model('Inventory');
const Config = mongoose.model('Config');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      aliases: ['lottery'],
      cooldown: 10,
      description: 'View lotto details',
      extendedHelp: "View details regarding this week's lotto"
    });
  }

  async run(msg) {
    const inventory = await Inventory.findOne({
      memberID: msg.author.id
    }).exec();

    if (!inventory)
      return msg.sendEmbed(
        new MessageEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register your profile"
          )
          .setColor('#f44336')
      );

    const totalLottos = await Config.findOne({ key: 'totalLottos' }).exec();

    let lotStr = '';

    inventory.lottos.forEach(lottoNum => {
      lotStr += `${lottoNum}\n`;
    });

    if (lotStr === '') lotStr = '[No Lotto tickets Purchased]';

    msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Lotto')
        .setDescription(
          `Your chances of winning lotto are **${
            inventory.lottos.length > 0
              ? Math.round((inventory.lottos.length / totalLottos.value) * 100)
              : 0
          }%**`
        )
        .addField('Total Prize Coins', totalLottos.value * 10)
        .addField("Total Lotto's purchased", totalLottos.value)
        .addField('Your total Lottos', inventory.lottos.length)
        .addField('Your lotto numbers', lotStr)
        .setColor('#2196f3')
    );
  }
***REMOVED***
