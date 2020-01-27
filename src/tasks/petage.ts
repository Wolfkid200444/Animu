// Dependencies
import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import _ from 'lodash';
import { IPet } from '../models/Pet';

// Init
const Pet = model('Pet');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const pets: Array<IPet> = await (<Promise<Array<IPet>>>Pet.find({}).exec());

    pets.forEach(async pet => {
      const age = await pet.petAge();

      const chancesOfDying = (age - 91.8367) / 816.327;

      if (Math.random() < chancesOfDying) {
        await Pet.deleteOne({ memberID: pet.memberID }).exec();

        this.client.users.get(pet.memberID).send(_.sample(reasons));
      }
    });
  }
};

const reasons = [
  'Your pet was hit by a car and died...F',
  'Your pet was attacked by a random dog and died...F',
  "Your pet discovered that you're retarded and decided to leave you...F",
  'Your pet was pretty ill and died...F',
  'Your pet went outside and got lost...forever...F',
  'Your pet fell from a building and died...F',
  'Your pet fell in a well and drowned...F',
];
