const { Command } = require('klasa');
const { createCanvas } = require('canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      cooldown: 10,
      description: 'Get image of a color',
      usage: '<color:string>',
    });
  }

  async run(msg, [color]) {
    const canvas = createCanvas(250, 250);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.fill(0, 0, 250, 250);
    return msg.send({
      files: [{ attachment: canvas.toBuffer(), name: 'color.png' }],
    });
  }
***REMOVED***
