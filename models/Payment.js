const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "GEL",
    },

    userEmail: {
      type: String,
      required: true,
    },

    userPhone: {
      type: String,
      required: true,
    },

    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designer",
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "canceled"],
      default: "pending",
    },

    unipayTransactionId: {
      type: String,
      default: null,
    },

    rawCallback: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
