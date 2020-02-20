// Imports
import express, { Application } from 'express';
import { KlasaClient } from 'klasa';

// Init
const api = express.Router();

module.exports = (app: Application, client: KlasaClient) => {
  api.get('/', (req, res) => {
    return res.send('HOME PAGE');
  });

  app.use('/api/v1', api);
};
