const { Router } = require("express");
const urlController = require("../controllers/urlController");

const router = Router();

router.get("/", urlController.home);
router.post("/shorten", urlController.shorten);
router.get("/:shortUrl", urlController.redirect);

module.exports = router;
