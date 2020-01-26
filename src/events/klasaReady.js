const { Event } = require('klasa');
const { botEnv } = require('../config/keys');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

module.exports = class extends Event {
  async run() {
    this.client.user.setActivity('Cultured Anime', { type: 'WATCHING' });
    this.client.settings.aldoviaInviteLink = 'https://discord.gg/JGsgBsN';
    this.client.settings.aldoviaDescription =
      'An anime server made for weebs by weebs';
    this.client.settings.animuStaff = [];

    if (botEnv === 'production') {
      this.client.guilds.get('556442896719544320').members.forEach(member => {
        if (member.roles.find(r => r.name === '🛡 Senior Moderator'))
          this.client.settings.animuStaff.push(member.id);
      });
    } else {
      this.client.settings.animuStaff = [];
    }

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
***REMOVED***
