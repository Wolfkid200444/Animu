const {
  Command,
  util: { isFunction },
} = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['commands'],
      guarded: true,
      description: 'Display Help for a command',
      usage: '(Command:command)',
    });

    this.createCustomResolver('command', (arg, possible, message) => {
      if (!arg || arg === '') return undefined;
      return this.client.arguments.get('command').run(arg, possible, message);
    });
  }

  async run(message, [command]) {
    if (command) {
      const info = [
        `= ${command.name} = `,
        isFunction(command.description)
          ? command.description(message.language)
          : command.description,
        message.language.get(
          'COMMAND_HELP_USAGE',
          command.usage.fullUsage(message)
        ),
        message.language.get('COMMAND_HELP_EXTENDED'),
        isFunction(command.extendedHelp)
          ? command.extendedHelp(message.language)
          : command.extendedHelp,
      ].join('\n');
      return message.sendMessage(info, { code: 'asciidoc' });
    }

    return message.send(this.buildHelp(message));
  }

  buildHelp(message) {
    const { prefix } = message.guildSettings;
    const commandNames = [...this.client.commands.keys()];

    return new MessageEmbed({
      title: 'Help',
      description: `
To view list of commands, [Click Here](https://aldovia.moe/animu-commands/)

You can use a command like this:
\`${prefix}${_.sample(commandNames)}\`

To view some guides that'll help you understand some of the Animu Concepts, [Click Here](https://help.animu.aldovia.moe)

Hope that helps you :))`,
      color: 0x2196f3,
    });
  }
};
