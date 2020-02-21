import { Command, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import redis from 'redis';
import bluebird from 'bluebird';
import randtoken from 'rand-token';

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      aliases: ['gen-token', 'generate-token'],
      runIn: ['dm'],
      requiredPermissions: ['EMBED_LINKS'],
      description:
        'Generate a token to login with Animu Web/Mobile App (IMPORTANT: Generating a new token will invalidate your previous token)',
    });
  }

  async run(msg: KlasaMessage) {
    const token = randtoken.generate(16);
    const tokens = await redisClient.hgetallAsync('auth_tokens_v1');
    const tokensToDelete = [];
    for (const t in tokens) {
      if (Object.prototype.hasOwnProperty.call(tokens, t)) {
        if (tokens[t] === msg.author.id) tokensToDelete.push(t);
      }
    }

    if (tokensToDelete.length > 0)
      await redisClient.hdelAsync('auth_tokens_v1', tokensToDelete);

    await redisClient.hsetAsync('auth_tokens_v1', token, msg.author.id);

    return msg.send(
      new MessageEmbed({
        title: 'Animu Token',
        description: `You can use this token or scan the QR Code to authenticate Animu Companion App\n\`\`\`${token}\`\`\``,
        color: 0x2196f3,
      })
        .setImage(`http://api.qrserver.com/v1/create-qr-code/?data=${token}`)
        .setFooter('DO NOT SHARE THIS TOKEN WITH ANYONE!')
    );
  }
};
