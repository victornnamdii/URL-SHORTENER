const express = require('express');
const mongoose = require('mongoose');
const urlRouter = require('./routes/urlShortenerRoutes');

require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(urlRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  app.listen(port, () => {
    console.log(`URL Shortener started on port ${port}`)
  });
});
