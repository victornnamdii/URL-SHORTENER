const Queue = require("bull");
const pool = require("../pool/queries");
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
  console.log("Increment Click Queue Error");
  console.log(error);
});

// eslint-disable-next-line consistent-return
incrementClickQueue.process(async (job, done) => {
  const { shortUrl } = job.data;
  try {
    await pool.query("UPDATE shorturls SET clicks = clicks + 1 WHERE short = $1",
    [shortUrl]
    );
  } catch (error) {
    console.log(error)
    return done(error);
  }
  done();
});

module.exports = { incrementClickQueue };
