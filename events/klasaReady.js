const { Event } = require('klasa');

module.exports = class extends Event {
  async run() {
    this.client.user.setActivity('over Aldovia Network', { type: 'WATCHING' });
    this.client.settings.aldoviaInviteLink = 'https://discord.gg/JGsgBsN';
    this.client.settings.aldoviaDescription =
      'An anime server made for weebs by weebs';
    this.client.settings.aldoviaSeniorMods = [
      '477853785436192769', //Kitty
      '555394471320092684' //Saeba
    ];

    //-> Scheduling Tasks
    if (!this.client.schedule.tasks.find(task => task.taskName === 'lotto'))
      this.client.schedule.create('lotto', '11 3 * * *');
  }
***REMOVED***
