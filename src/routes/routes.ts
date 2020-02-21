// Imports
import express from 'express';
import { KlasaClient } from 'klasa';
import bodyParser from 'body-parser';

// Init
const app = express();
app.use(bodyParser.json());

module.exports = (client: KlasaClient) => {
  // Root
  app.get('/', (req, res) => res.json({ status: 'online' }));

  // API v0
  require('./api')(app, client);

  // API v1
  require('./api/v1/api')(app, client);

  app.listen(8080);
};
