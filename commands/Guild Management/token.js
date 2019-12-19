const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const redis = require('redis');
const bluebird = require('bluebird');
var randtoken = require('rand-token');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      aliases: ['gen-token', 'generate-token'],
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      description:
        'Generate a token to login with Animu App (IMPORTANT: Generating a new token will invalidate your previous token)',
    });
  }

  async run(msg) {
    const token = randtoken.generate(16);
    await redisClient.hsetAsync('auth_tokens', token, msg.guild.id);

    msg.send(
      new MessageEmbed({
        title: 'Animu Token',
        description: `You can use this token or scan the QR Code to authenticate Animu Companion App\n\`\`\`${token}\`\`\``,
        color: 0x2196f3,
      })
        .setImage(`http://api.qrserver.com/v1/create-qr-code/?data=${token}`)
        .setFooter('DO NOT SHARE THIS TOKEN WITH ANYONE!')
    );
  }
***REMOVED***
