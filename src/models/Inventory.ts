// Dependencies
import { Schema, model, Model } from 'mongoose';
import { IInventoryDocument } from '../interfaces/IInventoryDocument';

// Interfaces
export interface IInventory extends IInventoryDocument {
  addCoins(amount: number): Promise<boolean>;
  deductCoins(amount: number): Promise<boolean>;
  giveItem(itemName: string): Promise<boolean>;
  takeItem(itemName: string): Promise<boolean>;
  checkIn(): Promise<boolean>;
}

export interface IInventoryModel extends Model<IInventory> {}

// Schema
const inventorySchema: Schema<IInventory> = new Schema({
  memberID: {
    type: String,
    unique: true,
  },
  coins: Number,
  inventory: [String],
  checkedIn: Boolean,
});

// Schema Methods
inventorySchema.methods.addCoins = async function(amount) {
  this.coins += amount;

  await this.save();
  return true;
***REMOVED***

inventorySchema.methods.giveItem = async function(itemName) {
  this.inventory.push(itemName);

  await this.save();
  return true;
***REMOVED***

inventorySchema.methods.deductCoins = async function(amount) {
  this.coins -= amount;

  await this.save();
  return true;
***REMOVED***

inventorySchema.methods.takeItem = async function(itemName) {
  const index = this.inventory.indexOf(itemName);

  if (index < 0) return false;

  this.inventory.splice(index, 1);

  await this.save();
  return true;
***REMOVED***

inventorySchema.methods.checkIn = async function() {
  this.coins += 30;
  this.checkedIn = true;

  await this.save();
  return true;
***REMOVED***

// Exporting
export const Inventory: IInventoryModel = model<IInventory, IInventoryModel>(
  'Inventory',
  inventorySchema
);
