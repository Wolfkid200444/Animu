import { Application } from 'express';
import { model } from 'mongoose';
import { IInventoryModel } from '../models/Inventory';

//@ts-ignore
const Inventory = <IInventoryModel>model('Inventory');

export default (app: Application) => {
  app.get('/webhooks', (req, res) => {
    console.log(req.body);
    res.json({ status: 'active' });
  });
};
