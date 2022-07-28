const mongoose = require('mongoose');
const URLModel = require('./models/Url.model');
const validUrl = require('valid-url');
const bodyParser = require('body-parser');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async function(req, res) {
  try {
    const url = req.body.url;
    if (!validUrl.isWebUri(url) || !validUrl.isUri(url)) {
      res.json({ error: 'invalid url' })
    } else {
      let findUrl = await URLModel.findOne({
        original_url: url
      });
      if (findUrl) {
        res.json({
          original_url: findUrl.original_url,
          short_url: findUrl.short_url
        });
      } else {
        let createUrl = await URLModel.create({
          original_url: url
        });
        res.json({
          original_url: createUrl.original_url,
          short_url: createUrl.short_url
        });
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json('Server erorr...')
  }
});

app.get('/api/shorturl/:short_url?', async function(req, res) {
  try {
    const urlParams = await URLModel.findOne({
      short_url: req.params.short_url
    })
    if (urlParams) {
      return res.redirect(urlParams.original_url)
    } else {
      return res.status(404).json('No URL found')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json('Server erorr...')
  }
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
