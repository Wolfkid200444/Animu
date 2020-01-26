const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Is Karen a woman or a man?',
      aliases: ['guess-gender'],
      cooldown: 10,
      usage: '<name:string>',
      quotedStringSupport: true,
    });
  }

  async run(msg, [name]) {
    const { data: body } = await axios.get(`https://api.genderize.io/`, {
      params: { name },
    });
    if (!body.gender)
      return msg.send(`I have no idea what gender ${body.name} is.`);

    return msg.send(
      `I'm ${body.probability * 100}% sure ${body.name} is a ${
        body.gender
      } name.`
    );
  }
***REMOVED***
