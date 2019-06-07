module.exports = (app, client) => {
  app.get('/', (req, res) => {
    res.json({ status: 'Online' });
  });

  app.get('/webhooks', (req, res) => {
    //TODO: Change to POST
    res.json({ res: 'success' });
  });
***REMOVED***
