const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['enchantify'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description:
        'ᒷリᓵ⍑ᔑリℸ ̣ ℸ ̣ᒷ·/ℸ ̣ ╎リℸ ̣𝙹 ᒲ╎リᒷᓵ∷ᔑ⎓ℸ ̣ ᒷリᓵ⍑ᔑリℸ ̣ᒲᒷリℸ ̣ ℸ ̣ᔑʖꖎᒷ ꖎᔑリ⊣⚍ᔑ⊣ᒷ',
      usage: '<text:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [text]) {
    msg.sendEmbed(
      new MessageEmbed()
        .setTitle(`${msg.member.displayName} says`)
        .setDescription(
          text
            .replace(/a/gi, 'ᔑ')
            .replace(/b/gi, 'ʖ')
            .replace(/c/gi, 'ᓵ')
            .replace(/d/gi, '↸')
            .replace(/e/gi, 'ᒷ')
            .replace(/f/gi, '⎓')
            .replace(/g/gi, '⊣')
            .replace(/h/gi, '⍑')
            .replace(/i/gi, '╎')
            .replace(/j/gi, '⋮')
            .replace(/k/gi, 'ꖌ')
            .replace(/l/gi, 'ꖎ')
            .replace(/m/gi, 'ᒲ')
            .replace(/n/gi, 'リ')
            .replace(/o/gi, '𝙹')
            .replace(/p/gi, '!¡')
            .replace(/q/gi, 'ᑑ')
            .replace(/r/gi, '∷')
            .replace(/s/gi, 'ᓭ')
            .replace(/t/gi, 'ℸ ̣')
            .replace(/u/gi, '⚍')
            .replace(/v/gi, '⍊')
            .replace(/w/gi, '∴')
            .replace(/x/gi, '·/')
            .replace(/y/gi, '||')
            .replace(/z/gi, '⨅')
        )
        .setColor('#2196f3')
    );
  }
***REMOVED***
