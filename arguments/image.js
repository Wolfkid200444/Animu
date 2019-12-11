const { Argument } = require('klasa');
const isImageURL = require('is-image-url');

module.exports = class extends Argument {
  run(arg) {
    if (arg.startsWith('<@') && arg.endsWith('>')) {
      arg = arg.slice(2, -1);

      if (arg.startsWith('!')) {
        arg = arg.slice(1);
      }

      if (this.client.users.get(arg))
        return this.client.users
          .get(arg)
          .displayAvatarURL({ format: 'png', size: 512 });
      else throw 'Invalid user mentioned';
    } else {
      if (isImageURL(arg)) return arg;
      else throw 'Invalid Image URL';
    }
  }
***REMOVED***
