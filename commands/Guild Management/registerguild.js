const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

//Init
const Guild = mongoose.model('Guild');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 7,
      runIn: ['text'],
      description: 'Register your guild',
      usage: '<key:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [key]) {}
***REMOVED***
