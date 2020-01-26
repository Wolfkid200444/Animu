const { Command } = require('klasa');
const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { drawImageWithTint } = require('../../util/Canvas');
const path = require('path');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Triggered?',
      usage: '<user:member>',
    });
    this.coord1 = [-25, -33, -42, -14];
    this.coord2 = [-25, -13, -34, -10];
  }

  async run(msg, [user]) {
    const image = user.user.displayAvatarURL({ format: 'png', size: 512 });

    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', '..', 'assets', 'images', 'triggered.png')
      );
      const avatar = await loadImage(image);
      const encoder = new GIFEncoder(base.width, base.width);
      const canvas = createCanvas(base.width, base.width);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, base.width, base.width);
      const stream = encoder.createReadStream();
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(50);
      encoder.setQuality(200);
      for (let i = 0; i < 4; i++) {
        drawImageWithTint(
          ctx,
          avatar,
          'red',
          this.coord1[i],
          this.coord2[i],
          300,
          300
        );
        ctx.drawImage(base, 0, 218, 256, 38);
        encoder.addFrame(ctx);
      }
      encoder.finish();
      const buffer = await this.streamToArray(stream);
      return msg.send({
        files: [{ attachment: Buffer.concat(buffer), name: 'triggered.gif' }],
      });
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }

  streamToArray(stream) {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data) {
        array.push(data);
      }
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      }
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    });
  }
***REMOVED***
