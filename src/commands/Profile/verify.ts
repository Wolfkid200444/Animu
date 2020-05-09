// Dependencies
import { Command, CommandStore, KlasaMessage } from 'klasa';
// import prompt from 'discordjs-prompter';
import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

// Init
const { Canvas, Image, ImageData } = canvas;
//@ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

module.exports = class extends Command {
  constructor(store: CommandStore, file: string[], dir: string) {
    super(store, file, dir, {
      runIn: ['dm'],
      requiredPermissions: ['EMBED_LINKS'],
      cooldown: 10,
      description: 'Verify yourself',
      extendedHelp: 'Verify your Identity & Age',
    });
  }

  async run(msg: KlasaMessage) {
    // const res = await prompt.reaction(msg.channel, {
    //   question: `**Identity Verification**\nTo verify your Identity & Age, you will be asked to send a selfie of yours and a picture of your ID Card\n\nPlease note that **none** of the pictures you provide will be saved anywhere\n\nDo you wish to begin verification?`,
    //   userId: msg.author.id,
    //   timeout: 60000,
    // });

    // if (!res || res === 'no') return msg.send('Verification Cancelled');

    // const selfieRes = await prompt.message(msg.channel, {
    //   question: 'Please send your selfie that clearly shows your face',
    //   userId: msg.author.id,
    //   max: 1,
    //   timeout: 120000,
    // });

    // if (!selfieRes) {
    //   return msg.send(`Verification Time Out`);
    // }

    // let selfieFile = selfieRes.first().attachments.first();

    // if (!selfieFile)
    //   return msg.send('No file was provided, Verification Cancelled');

    // const docRes = await prompt.message(msg.channel, {
    //   question:
    //     'Now Please send a picture of your ID that clearly shows your date of birth and your picture',
    //   userId: msg.author.id,
    //   max: 1,
    //   timeout: 120000,
    // });

    // if (!docRes) {
    //   return msg.send(`Verification Time Out`);
    // }

    // let docFile = docRes.first().attachments.first();

    // if (!docFile)
    //   return msg.send('No file was provided, Verification Cancelled');

    // formData.append(
    //   'url',
    //   'https://cdn.discordapp.com/attachments/633336379866218507/707291231973277746/image0.png'
    // );
    // formData.append(
    //   'faceurl',
    //   'https://cdn.discordapp.com/attachments/633336379866218507/707291189350629456/image0.png'
    // );

    // const image = await canvas.loadImage(
    //   'https://cdn.discordapp.com/attachments/633336379866218507/707291189350629456/image0.png'
    // );

    // // Safe distance so far: <0.5

    // const images = await faceapi
    //   //@ts-ignore
    //   .detectAllFaces(image)
    //   .withFaceLandmarks()
    //   .withFaceDescriptor();

    // if (images.length < 2)
    //   return msg.send(
    //     'Either your face or your ID Card is not properly visible'
    //   );

    // const selfie = images[0];
    // const doc = images[1];

    // const faceMatcher = new faceapi.FaceMatcher(selfie);

    // const matched = faceMatcher.findBestMatch(doc.descriptor);

    // console.log(matched);

    return msg.send(`Command under development`);
  }

  async init() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('assets/models');
  }
};
