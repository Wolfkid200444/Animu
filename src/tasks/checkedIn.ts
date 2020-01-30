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

    await Inventory.updateMany({}, { checkedIn: false });
  }
};
