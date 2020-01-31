import { Application } from 'express';
// import { model } from 'mongoose';
// import { IInventoryModel } from '../models/Inventory';
import { KlasaClient } from 'klasa';

// //@ts-ignore
// const Inventory = <IInventoryModel>model('Inventory');

module.exports = (app: Application, client: KlasaClient) => {
  app.post('/hook', (req, res) => {
    res.json({ status: 'active' });
    console.log(req.body);
  });
};
