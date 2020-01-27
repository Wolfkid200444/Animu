// Dependencies
import { Task } from 'klasa';
import { botEnv } from '../config/keys';
import { model } from 'mongoose';
import { IBankAccount } from '../models/BankAccount';
import { IInventory } from '../models/Inventory';

// Init
const BankAccount = model('BankAccount');
const Inventory = model('Inventory');

module.exports = class extends Task {
  async run() {
    if (botEnv !== 'production') return;

    const bankaccounts: Array<IBankAccount> = await (<
      Promise<Array<IBankAccount>>
    >BankAccount.find({}).exec());

    bankaccounts.forEach(async account => {
      const inv: IInventory = await (<Promise<IInventory>>Inventory.findOne({
        memberID: account.memberID,
      }).exec());

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
***REMOVED***
