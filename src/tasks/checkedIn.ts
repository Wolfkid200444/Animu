// Dependencies
import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import { IInventoryModel } from '../models/Inventory';

// Init
const Inventory: IInventoryModel = <IInventoryModel>model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const inventories = await Inventory.find({}).exec();

    inventories.forEach(async inventory => {
      inventory.checkedIn = false;
      await inventory.save();
    });
  }
};
