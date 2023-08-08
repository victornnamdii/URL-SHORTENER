const { isURL } = require("validator");
const { incrementClickQueue } = require('../queues/incrementClickQueue');
const shortUrl = require('../models/shortUrls');

const checkLink = (string) => {
  return isURL(string, {
    require_protocol: true,
    require_valid_protocol: true,
    allow_protocol_relative_urls: true,
  })
}

class urlController {
  static async home(req, res) {
    try {
      const shortUrls = await shortUrl.find()
      res.render('index', { shortUrls });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  static async shorten(req, res) {
    try {
      const { fullUrl } = req.body;
      if (!fullUrl) {
        res.status(400).json({ error: "Please enter a link"});
        return;
      }
      if (!checkLink(fullUrl)) {
        res.status(400).json({
          error: "Please enter a valid URL. It should start with either 'https://', 'http://' or 'ftp://'"
        })
      }
      const url = await shortUrl.create({ full: req.body.fullUrl });
      res.status(201).json({ message: "URL Shortened successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async redirect(req, res) {
    try {
      const url = await shortUrl.findOne({ short: req.params.shortUrl });
      if (!url) {
        return res.status(404).json({
          error: "Page not found",
        });
      }

      incrementClickQueue.add({ id: url._id });

      res.redirect(url.full);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = urlController;
