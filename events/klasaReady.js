const { Event } = require('klasa');

module.exports = class extends Event {
  async run() {
    this.client.user.setActivity('over Aldovia Network', { type: 'WATCHING' });
    this.client.settings.aldoviaInviteLink = 'https://discord.gg/JGsgBsN';
    this.client.settings.aldoviaDescription =
      'An anime server made for weebs by weebs';
    this.client.settings.aldoviaSeniorMods = [
      '477853785436192769', //Kitty
      '555394471320092684', //Saeba
    ];
    this.client.settings.patreonCurrent = 46;

    //-> Scheduling Tasks

    if (!this.client.schedule.tasks.find((task) => task.taskName === 'petfed'))
      this.client.schedule.create('petfed', '0 * * * *');

    if (
      !this.client.schedule.tasks.find(
        (task) => task.taskName === 'changedbanner',
      )
    )
      this.client.schedule.create('changedbanner', '0 0 * * *');
  }
***REMOVED***
