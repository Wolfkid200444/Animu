const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      description: 'Mange Todos',
      extendedHelp: 'add|remove|list your TODOs through DM or text channels',
      usage: '<add|remove|list:default> (TODO:string) [content:...string]',
      usageDelim: ' ',
      subcommands: true,
      quotedStringSupport: true
    });
    this.createCustomResolver('string', (arg, possible, message, [action]) => {
      if (action === 'list') return arg;
      return this.client.arguments.get('string').run(arg, possible, message);
    });
  }

  async add(message, [TODO, content]) {
    await message.author.settings.update(
      'TODOs',
      [...message.author.settings.TODOs, [TODO, content]],
      { action: 'overwrite' }
    );
    return message.sendEmbed(
      new MessageEmbed()
        .setTitle('New Todo Created')
        .setDescription(`New todo was created with title \`${TODO}\``)
        .setColor('#2196f3')
    );
  }

  async remove(message, [TODO]) {
    const filtered = message.author.settings.TODOs.filter(
      ([name]) => name !== TODO
    );
    await message.author.settings.update('TODOs', filtered, {
      action: 'overwrite'
    });
    return message.sendEmbed(
      new MessageEmbed()
        .setTitle('Todo Removed')
        .setDescription(`A todo was removed with title \`${TODO}\``)
        .setColor('#2196f3')
    );
  }

  list(message) {
    let str = '';

    message.author.settings.TODOs.forEach(todo => {
      str += `• ${todo[0]}\n${todo[1]}\n\n`;
    });

    return message.sendEmbed(
      new MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ size: 32 })
        )
        .setTitle(`Todos`)
        .setDescription(str)
        .setColor('#2196f3')
    );
  }
***REMOVED***
