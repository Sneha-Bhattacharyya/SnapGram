const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use(bodyParser.json());
app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body.name);
});
app.listen(5000);
