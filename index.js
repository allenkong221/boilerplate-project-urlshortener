require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

let routes = [];

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const postUrl = req.body.url;
  if(postUrl && /^(ftp|http|https):\/\/[^ "]+$/.test(postUrl)) {
    routes.push(postUrl);
    res.json({
      original_url: postUrl,
      short_url: routes.length
    });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:index', function (req, res) {
  const target = routes[req.params.index - 1];
  target ? res.redirect(target) : res.json({error: 'invalid id'});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
