const { RichEmbed } = require('discord.js');

function getInventoryEmbed(msg, inventory) {
  let inventoryStr = '';
  const inventoryItems = {***REMOVED***

  inventory.inventory.forEach(item => {
    inventoryItems[item] = inventoryItems[item] + 1 || 1;
  });

  for (var item in inventoryItems)
    inventoryStr +=
      inventoryItems[item] > 1
        ? `${item} x${inventoryItems[item]}\n`
        : `${item}\n`;

  const moderatorRole = msg.guild.roles.find(r => r.name === 'Moderator');
  const seniorModeratorRole = msg.guild.roles.find(
    r => r.name === 'Senior Moderator'
  );
  const serverAdminRole = msg.guild.roles.find(
    r => r.name === '👑 Server Admin 👑'
  );

  if (
    msg.guild.members.get(inventory.memberID).roles.has(moderatorRole) ||
    msg.guild.members.get(inventory.memberID).roles.has(seniorModeratorRole) ||
    msg.guild.members.get(inventory.memberID).roles.has(serverAdminRole)
  )
    return msg.embed(
      new RichEmbed()
        .setTitle('No Inventory')
        .setDescription(
          "Moderators, Senior Moderators and Server Admins can't view/use their inventory"
        )
        .setColor('#f44336')
    );

  return new RichEmbed()
    .setTitle(
      `${msg.guild.members.get(inventory.memberID).displayName}'s Inventory`
    )
    .addField('Coins', inventory.coins)
    .addField('Inventory', inventoryStr || '[Inventory is empty]')
    .setColor('#2196f3');
}

module.exports.getInventoryEmbed = getInventoryEmbed;
