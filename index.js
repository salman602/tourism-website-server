const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Gello World!')
});

app.listen(port, () => {
  console.log(`Running on the port: ${port}`)
});