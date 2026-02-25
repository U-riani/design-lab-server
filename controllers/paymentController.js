const Payment = require("../models/Payment");
const generateOrderId = require("../utils/generateOrderId");
const { createPayment } = require("../services/paymentService");

exports.startPayment = async (req, res) => {
  try {
    const { amount, email, phone } = req.body;

    if (!amount || !email || !phone) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const orderId = generateOrderId();

    const newPayment = await Payment.create({
      orderId,
      amount,
      userEmail: email,
      userPhone: phone,
      status: "pending",
    });

    const result = await createPayment(amount, orderId, email, phone);

    return res.json({
      payment_url: result.redirect_url,
      order_id: orderId,
    });
  } catch (err) {
    console.error("Payment start error:", err);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};

// UniPay callback
exports.handleCallback = async (req, res) => {
  try {
    const callback = req.body;

    const { order_id, transaction_id, status } = callback;

    const payment = await Payment.findOne({ orderId: order_id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status;
    payment.unipayTransactionId = transaction_id;
    payment.rawCallback = callback;

    await payment.save();

    return res.json({ message: "Callback received" });
  } catch (err) {
    console.error("Callback error:", err);
    return res.status(500).json({ message: "Callback error" });
  }
};
