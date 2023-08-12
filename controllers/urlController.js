const shortId = require("shortid");
const { isURL } = require("validator");
const { incrementClickQueue } = require('../queues/incrementClickQueue');
const pool = require('../pool/queries');


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
      const { rows } = await pool.query("SELECT * FROM shorturls");
      res.render('index', { rows });
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
      const shortUrl = shortId.generate();
      await pool.query(
        "INSERT INTO shorturls (fullurl, short) VALUES ($1, $2)",
        [fullUrl, shortUrl]
      );
      res.status(201).json({
        message: `URL Shortened successfully to ${shortUrl}`
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async redirect(req, res) {
    try {
      const { shortUrl } = req.params;
      const { rows } = await pool.query(
        "SELECT fullurl FROM shorturls WHERE short = $1",
        [shortUrl]
      );
      if (!rows[0]) {
        return res.status(404).json({
          error: "Page not found",
        });
      }

      incrementClickQueue.add({ shortUrl });

      res.redirect(rows[0].fullurl);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = urlController;
