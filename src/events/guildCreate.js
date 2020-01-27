const { Event } = require('klasa');
const mongoose = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');

//Init
const Guild = mongoose.model('Guild');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Event {
  async run(guild) {
    const firstChannel = guild.channels
      .filter(
        ch =>
          ch.permissionsFor(guild.me).has('SEND_MESSAGES') && ch.type === 'text'
      )
      .sort((a, b) => a.rawPosition - b.rawPosition)
      .first();

    firstChannel.send(`
Thanks for having me here! <:wave:605078389925085206>
My name's Animu and my purpose is to make your server moar better <a:YAY_1:619057676336496661>
> To get list of commands, use \`-help\` or visit this link: <https://aldovia.moe/animu-commands/>
> To get help regarding a specific command, use \`-help command\`
> To view your profile, use \`-p\`
> To view your inventory, use \`-inv\`
> Visit this link for some useful guides: <https://aldovia.moe/tag/animu/>
> Download Animu Companion App from here: <https://github.com/LightYagami200/Animu-Companion/releases>\n
Need help? Join the support server: discord.gg/JGsgBsN
    `);

    const existingGuild = await Guild.findOne({ guildID: guild.id }).exec();

    if (existingGuild) return;

    await new Guild({
      guildID: guild.id,
      tier: 'free',
      levelPerks: [],
    }).save();

    await redisClient.hsetAsync('guild_tiers', guild.id, 'free');
  }
};
