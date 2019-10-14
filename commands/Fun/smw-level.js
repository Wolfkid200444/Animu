const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Get a random super mario level name',
    });
  }

  async run(msg) {
    const start = _.sample(startLevels);
    const end = _.sample(endLevels);

    return msg.sendEmbed(
      new MessageEmbed()
        .setTitle('Super Mario Level')
        .setDescription(`${start} ${end}`)
        .setColor(0x2196f3),
    );
  }
***REMOVED***

//Start Levels
const startLevels = [
  'Bonus',
  'Vanilla',
  'Top Secret',
  'Donut',
  "Mortan's",
  'Green',
  'Butter',
  "Ludwig's",
  'Cheese Bridge',
  'Cookie',
  'Soda',
  'Star',
  'Yellow',
  'Sunken',
  "Wendy's",
  'Chocolate',
  'Forest',
  "Roy's",
  'Choco',
  "Iggy's",
  "Yoshi's",
  'Front',
  'Back',
  "Bowser's",
  'Valley of',
  "Larry's",
  'Red',
  "Lemmy's",
  'Forest of',
  'Blue',
  'Funky',
  'Outrageous',
  'Mondo',
  'Groovy',
  'Gnarly',
  'Tubular',
  'Way Cool',
  'Awesome',
  'Unused',
  'Eat',
];

//End Levels
const endLevels = [
  'Game Room',
  'Secret 2',
  'Secret 3',
  'Area',
  'Ghost House',
  'Plains 3',
  'Plains 4',
  'Castle',
  'Switch Palace',
  'Plains 2',
  'Secret 1',
  'Fortress',
  'Bridge 1',
  'Bridge 2',
  'Mountain',
  'Lake',
  'Road',
  'Secret House',
  'Plains 1',
  'Plains',
  'Ghost Ship',
  'Island 5',
  'Island 4',
  'Island 1',
  'Island 3',
  'Island 2',
  'House',
  'Secret 1',
  'Dome 3',
  'Door',
  'Bowser 4',
  'Bowser 3',
  'Bowser 2',
  'Bowser 1',
  'Secret',
  'Dome 2',
  'Dome 4',
  'Dome 1',
  'Illusion 1',
  'Illusion 4',
  'Illusion 2',
  'Secret Area',
  'Illusion 3',
  'World 2',
  'World 3',
  'World 1',
  'World 4',
  'World 5',
  'Pant',
];
