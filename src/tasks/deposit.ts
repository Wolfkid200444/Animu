// Dependencies
import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import { IBankAccountModel } from '../models/BankAccount';
import { IInventoryModel } from '../models/Inventory';

// Init
const BankAccount: IBankAccountModel = <IBankAccountModel>model('BankAccount');
const Inventory: IInventoryModel = <IInventoryModel>model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const bankaccounts = await BankAccount.find({}).exec();

    bankaccounts.forEach(async account => {
      const inv = await Inventory.findOne({
        memberID: account.memberID,
      }).exec();

      account.deposits.forEach((deposit, i) => {
        if (deposit.daysLeft > 0) deposit.daysLeft--;
        if (deposit.daysLeft === 0) {
          inv.addCoins(deposit.coins);

          account.deposits.splice(i, 1);
        }
      });
      console.log('Deposit Account (After)', account);
      await account.save();
    });
  }
};
