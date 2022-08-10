const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

// use production address in live version
mongoose.connect('mongodb://localhost/shrink-url', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (err) {
    res.status(401).send({ success: false, message: err });
  }
});

app.post('/shrinkUrl', async (req, res) => {
  try {
    await ShortUrl.create({ full: req.body.fullUrl });

    res.redirect('/')
  } catch (err) {
    res.status(401).send({ success: false, message: err });
  }
});

app.get('/:shinker', async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shinker });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    await shortUrl.save();

    res.redirect(shortUrl.full);
  } catch (err) {
    res.status(401).send({ success: false, message: err });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log('[+] server restarted successfully 😎');
});