const Queue = require("bull");
const ShortURL = require("../models/shortUrls");
require("dotenv").config();

const incrementClickQueue = new Queue("Increment Click", {
  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "fixed",
      delay: 5000,
    },
  },
});

incrementClickQueue.on("error", (error) => {
  console.log(error);
});

// eslint-disable-next-line consistent-return
incrementClickQueue.process(async (job, done) => {
  const { id } = job.data;
  try {
    const shortUrl = await ShortURL.findById(id);
    if (shortUrl) {
      shortUrl.clicks++;
      await shortUrl.save();
    }
  } catch (error) {
    return done(error);
  }
  done();
});

module.exports = { incrementClickQueue };
