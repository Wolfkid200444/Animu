const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: "View a user's Minecraft Skin",
      usage: '<user:string> <face|front|frontfull|head|bust|full|skin>',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, type]) {
    try {
      const search = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${user}`
      );
      if (search.status === 204) return msg.send('Could not find any results.');
      return msg.send({
        files: [
          `https://visage.surgeplay.com/${type}/512/${search.data.id}.png`,
        ],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
