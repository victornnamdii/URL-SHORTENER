const express = require('express');
const urlRouter = require('./routes/urlShortenerRoutes');

require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(urlRouter);

app.listen(port, () => {
  console.log(`URL Shortener started on port ${port}`)
});
