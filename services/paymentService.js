const crypto = require("crypto");

const UNIPAY_MERCHANT_ID = process.env.UNIPAY_MERCHANT_ID;
const UNIPAY_SECRET_KEY = process.env.UNIPAY_SECRET_KEY;
const UNIPAY_API_URL = process.env.UNIPAY_API_URL;

// Create HMAC signature
function generateSignature(payload, secretKey) {
  const jsonString = JSON.stringify(payload);
  return crypto.createHmac("sha256", secretKey).update(jsonString).digest("hex");
}

async function createPayment(amount, orderId, userEmail, userPhone) {
  const payload = {
    merchant_id: UNIPAY_MERCHANT_ID,
    order_id: orderId,
    amount: amount,
    currency: "GEL",
    return_url: process.env.UNIPAY_RETURN_URL,
    callback_url: process.env.UNIPAY_CALLBACK_URL,
    customer_email: userEmail,
    customer_phone: userPhone,
  };

  const signature = generateSignature(payload, UNIPAY_SECRET_KEY);

  const res = await fetch(UNIPAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-UNI-SIGNATURE": signature,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("UniPay ERROR:", text);
    throw new Error("UniPay payment init failed");
  }

  const data = await res.json();
  return data;
}

module.exports = {
  createPayment,
  generateSignature,
};
