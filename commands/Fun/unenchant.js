const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['unenchantify'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Try using this command on description of "enchant" command',
      usage: '<text:string>',
    });
  }

  async run(msg, [text]) {
    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} says`)
        .setDescription(
          text
            .replace(/ᔑ/gi, 'a')
            .replace(/ʖ/gi, 'b')
            .replace(/ᓵ/gi, 'c')
            .replace(/↸/gi, 'd')
            .replace(/ᒷ/gi, 'e')
            .replace(/⎓/gi, 'f')
            .replace(/⊣/gi, 'g')
            .replace(/⍑/gi, 'h')
            .replace(/╎/gi, 'i')
            .replace(/⋮/gi, 'j')
            .replace(/ꖌ/gi, 'k')
            .replace(/ꖎ/gi, 'l')
            .replace(/ᒲ/gi, 'm')
            .replace(/リ/gi, 'n')
            .replace(/𝙹/gi, 'o')
            .replace(/!¡/gi, 'p')
            .replace(/ᑑ/gi, 'q')
            .replace(/∷/gi, 'r')
            .replace(/ᓭ/gi, 's')
            .replace(/ℸ ̣/gi, 't')
            .replace(/⚍/gi, 'u')
            .replace(/⍊/gi, 'v')
            .replace(/∴/gi, 'w')
            .replace(/·\//gi, 'x')
            .replace(/\|\|/gi, 'y')
            .replace(/⨅/gi, 'z')
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
