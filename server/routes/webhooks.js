module.exports = (app, client) => {
  app.get('/webhooks', (req, res) => {
    //TODO: Change to POST
    res.json({ res: 'success' });
  });
***REMOVED***
