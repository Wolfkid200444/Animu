const { Task } = require('klasa');
const { botEnv } = require('../config/keys');
const mongoose = require('mongoose');
const _ = require('lodash');

//Init
const Pet = mongoose.model('Pet');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const pets = await Pet.find({}).exec();

    pets.forEach(async pet => {
      const age = await pet.petAge();

      const chancesOfDying = (age - 91.8367) / 816.327;

      if (Math.random() < chancesOfDying) {
        await Pet.deleteOne({ memberID: pet.memberID }).exec();

        this.client.users.get(pet.memberID).send(_.sample(reasons));
      }
    });
  }
***REMOVED***

const reasons = [
  'Your pet was hit by a car and died...F',
  'Your pet was attacked by a random dog and died...F',
  "Your pet discovered that you're retarded and decided to leave you...F",
  'Your pet was pretty ill and died...F',
  'Your pet went outside and got lost...forever...F',
  'Your pet fell from a building and died...F',
  'Your pet fell in a well and drowned...F',
];
