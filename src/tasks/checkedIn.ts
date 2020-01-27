// Dependencies
import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import { IInventory } from '../models/Inventory';

// Init
const Inventory = model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const inventories: Array<IInventory> = await (<Promise<Array<IInventory>>>(
      Inventory.find({}).exec()
    ));

    inventories.forEach(async inventory => {
      inventory.checkedIn = false;
      await inventory.save();
    });
  }
};
