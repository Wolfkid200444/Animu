import { Event } from 'klasa';
import { topGGAPIKey, animuAPIKey, botEnv } from '../config/keys';
import { model } from 'mongoose';
import redis from 'redis';
import bluebird from 'bluebird';
import { IInventoryModel } from '../models/Inventory';
const DBL = require('dblapi.js');

const dbl = new DBL(topGGAPIKey, {
  webhookPort: 5000,
  webhookAuth: animuAPIKey,
});
const Inventory = <IInventoryModel>model('Inventory');
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient: any = redis.createClient();

module.exports = class extends Event {
  async run() {
    this.client.user.setActivity('Cultured Anime', { type: 'WATCHING' });
    this.client.settings.update(
      'supportServerInviteLink',
      'https://discord.gg/JGsgBsN'
    );

    if (botEnv === 'production') {
      this.client.guilds.get('556442896719544320').members.forEach(member => {
        if (member.roles.find(r => r.name === '🛡 Senior Moderator'))
          this.client.settings.update('animuStaff', member.id);
      });
    }

    //-> Top GG Webhooks
    dbl.webhook.on('ready', hook => {
      console.log(
        `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
      );
    });
    dbl.webhook.on('vote', async vote => {
      const inventory = await Inventory.findOne({ memberID: vote.user }).exec();
      if (inventory) inventory.addCoins(15);
      console.log(`User with ID ${vote.user} just voted!`);
    });

    //-> Delete Any active games that might be cached
    await redisClient.delAsync('active_games');

    //-> Scheduling Tasks
    if (!this.client.schedule.tasks.find(task => task.taskName === 'petsats'))
      this.client.schedule.create('petstats', '0 * * * *');

    if (!this.client.schedule.tasks.find(task => task.taskName === 'checkedIn'))
      this.client.schedule.create('checkedIn', '0 0 * * *');

    if (!this.client.schedule.tasks.find(task => task.taskName === 'deposit'))
      this.client.schedule.create('deposit', '0 0 * * *');

    if (
      !this.client.schedule.tasks.find(task => task.taskName === 'premiumDays')
    )
      this.client.schedule.create('premiumDays', '0 0 * * *');

    if (!this.client.schedule.tasks.find(task => task.taskName === 'petage'))
      this.client.schedule.create('petage', '0 0 * * *');
  }
};
