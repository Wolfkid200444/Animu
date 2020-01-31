import { Application } from 'express';
import { model } from 'mongoose';
import { IInventoryModel } from '../models/Inventory';
import { KlasaClient } from 'klasa';

//@ts-ignore
const Inventory = <IInventoryModel>model('Inventory');

export default (app: Application, client: KlasaClient) => {
  app.post('/webhooks', (req, res) => {
    console.log(req.body);
    res.json({ status: 'active' });
  });
};
