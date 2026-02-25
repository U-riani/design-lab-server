const express = require("express");
const router = express.Router();

const {
  startPayment,
  handleCallback
} = require("../controllers/paymentController");

router.post("/create", startPayment);
router.post("/callback", handleCallback);

module.exports = router;
