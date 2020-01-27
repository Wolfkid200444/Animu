// Dependencies
import { Schema, model, Model } from 'mongoose';
import { IITemDocument } from '../interfaces/IItemDocument';
import { Message } from 'discord.js';

// Interfaces
export interface IItem extends IITemDocument {
  purchase(
    msg: Message,
    memberID: string,
    isStaff: boolean
  ): Promise<{ res: string; title: string; desc: string }>;
}

export interface IItemModel extends Model<IItem> {
  createItem(
    itemName: string,
    description: string,
    price: number,
    discount: number,
    usable: boolean,
    instantUse: boolean,
    inShop: boolean,
    purchaseMsg: string,
    properties: Array<string | number>
  ): Promise<IItem>;
}

// Schema
const itemSchema: Schema<IItem> = new Schema({
  name: {
    type: String,
    unique: true,
  },
  description: String,
  imageURL: String,
  price: Number,
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  usable: Boolean,
  instantUse: Boolean,
  inShop: Boolean,
  purchaseMsg: String,
  properties: [Schema.Types.Mixed],
});

//Model Methods
itemSchema.statics.createItem = async function(
  itemName,
  description,
  price,
  discount,
  usable,
  instantUse,
  inShop,
  purchaseMsg,
  properties
) {
  const item = await this.findOne({ name: itemName }).exec();

  if (item) return { res: 'already_exists', item };

  return await new this({
    name: itemName,
    description: description,
    price,
    discount,
    usable,
    instantUse,
    inShop,
    purchaseMsg,
    properties: properties.split(',').map(role => role.trim()),
  }).save();
};

//Schema Methods
itemSchema.methods.purchase = async function(msg, memberID, isStaff) {
  const inventory = await this.model('Inventory')
    .findOne({ memberID })
    .exec();

  let price = this.price - this.price * (this.discount / 100);

  if (isStaff) price = 0;

  if (inventory.coins < price)
    return {
      res: 'err',
      title: 'Insufficient Coins',
      desc: "You don't have enough coins to purchase this item",
    };

  //Purchasing item
  inventory.coins -= price;

  //Use item instantly
  if (this.instantUse) {
    if (this.name === 'Pet Cat' || this.name === 'Pet Dog') {
      const Pet = this.model('Pet');

      const existingPet = await Pet.findOne({ memberID }).exec();

      if (existingPet)
        return {
          res: 'err',
          title: 'Already Own a pet',
          desc:
            'You already own a pet, use `kickPet` command to kick out your current pet before you can purchase a new pet',
        };

      await new Pet({
        memberID: memberID,
        petType: this.name.substr(4).toLowerCase(),
        petName: this.name.substr(4),
      }).save();

      await inventory.save();
    }

    return {
      res: 'success',
      title: 'Item Purchased',
      desc: this.purchaseMsg,
    };
  } else {
    //Add item to inventory
    inventory.inventory.push(this.name);

    await inventory.save();

    return { res: 'success', title: 'Item Purchased', desc: this.purchaseMsg };
  }
};

export const Item: IItemModel = model<IItem, IItemModel>('Item', itemSchema);
