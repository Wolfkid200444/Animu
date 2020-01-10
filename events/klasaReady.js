const { Event } = require('klasa');
const { botEnv } = require('../config/keys');

module.exports = class extends Event {
  async run() {
    this.client.user.setActivity('over Weebs', { type: 'WATCHING' });
    this.client.settings.aldoviaInviteLink = 'https://discord.gg/JGsgBsN';
    this.client.settings.aldoviaDescription =
      'An anime server made for weebs by weebs';
    this.client.settings.aldoviaSeniorMods = [];
    this.client.settings.patreonCurrent = 0;

    if (botEnv === 'production') {
      this.client.guilds.get('556442896719544320').members.forEach(member => {
        if (member.roles.find(r => r.name === '🛡 Senior Moderator'))
          this.client.settings.aldoviaSeniorMods.push(member.id);
      });
    } else {
      this.client.settings.aldoviaSeniorMods = [];
    }

    //-> Scheduling Tasks
    if (!this.client.schedule.tasks.find(task => task.taskName === 'petsats'))
      this.client.schedule.create('petstats', '0 * * * *');

    if (
      !this.client.schedule.tasks.find(
        task => task.taskName === 'changedbanner'
      )
    )
      this.client.schedule.create('changedbanner', '0 0 * * *');

    if (!this.client.schedule.tasks.find(task => task.taskName === 'checkedIn'))
      this.client.schedule.create('checkedIn', '0 0 * * *');

    if (!this.client.schedule.tasks.find(task => task.taskName === 'deposit'))
      this.client.schedule.create('deposit', '0 0 * * *');

    if (
      !this.client.schedule.tasks.find(task => task.taskName === 'premiumDays')
    )
      this.client.schedule.create('premiumDays', '0 0 * * *');
  }
***REMOVED***
