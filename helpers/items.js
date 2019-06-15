const { RichEmbed } = require('discord.js');

function getItemEmbed(item) {
  let priceStr = '';
  if (item.discount === 0) priceStr = `${item.price} Coins`;
  else
    priceStr = `${item.price * (item.discount / 100)} ~~${item.price}~~ (${
      item.discount
    }% off)`;

  return new RichEmbed()
    .setTitle(item.name)
    .setDescription(item.description)
    .addField('Price', priceStr)
    .setColor('#2196f3');
}

module.exports.getItemEmbed = getItemEmbed;
