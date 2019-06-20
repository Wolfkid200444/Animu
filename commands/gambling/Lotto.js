//Dependencies
const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Inventory = mongoose.model('Inventory');
const Config = mongoose.model('Config');

//Main
module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lotto',
      aliases: [],
      group: 'gambling',
      memberName: 'lotto',
      throttling: {
        usages: 1,
        duration: 30
      },
      description: 'View lotto details',
      details:
        'View lotto details such as total purchased tickets, prize coins, chances of winning and your purchased tickets',
      examples: ['lotto']
    });
  }

  async run(msg) {
    const inventory = await Inventory.findOne({
      memberID: msg.author.id
    }).exec();

    if (!inventory)
      return msg.embed(
        new RichEmbed()
          .setTitle('Profile not found')
          .setDescription(
            "Your profile doesn't exist, use `register` command to register your profile"
          )
          .setColor('#f44336')
      );

    const totalLottos = await Config.findOne({ key: 'totalLottos' }).exec();

    let lotStr = '';

    inventory.lottos.forEach(lottoNum => {
      lotStr += `- ${lottoNum}\n`;
    });

    if (lotStr === '') lotStr = '[No Lotto tickets Purchased]';

    msg.embed(
      new RichEmbed()
        .setTitle('Lotto')
        .setDescription(
          `Your chances of winning lotto are **${
            inventory.lottos.length < 0
              ? (inventory.lottos.length / totalLottos) * 100
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
