const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description:
        'Deposit coins to the bank to earn interest after specific time',
      usage: '<1|4|12> <coins:int>',
      usageDelim: ' ',
      quotedStringSupport: true,
      extendedHelp:
        'You can deposit 1,000+ Coins to the bank using this command and gain interest once your period has ended.\nThere are 3 different Periods:\n- 1 Week (1% Interest/Week)\n- 4 Weeks (2% Interest/Week)\n- 12 Weeks (3% Interest/Week)\n\nYou CANNOT take out your money during the deposit period, your coins+interest will be automatically sent to your inventory once your period ends.',
    });
  }

  async run(msg, [period, coins]) {
    msg.sendEmbed(await msg.author.deposit(period, coins));
  }
***REMOVED***
