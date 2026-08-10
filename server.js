require("dotenv").config();

const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const PUBLIC_KEY = process.env.CHECKOUT_PUBLIC_KEY;
const SECRET_KEY = process.env.CHECKOUT_SECRET_KEY;

if (!PUBLIC_KEY || !SECRET_KEY) {
  throw new Error(
    "Missing CHECKOUT_PUBLIC_KEY or CHECKOUT_SECRET_KEY in .env"
  );
}

app.get("/config", (_req, res) => {
  res.json({ publicKey: PUBLIC_KEY });
});

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 6540,
        currency: "GBP",
        reference: "ORD-123A",
        description: "Payment for Guitars and Amps",
        billing_descriptor: {
          name: "Jia Tsang",
          city: "London",
        },
        customer: {
          email: "jia.tsang@example.com",
          name: "Jia Tsang",
        },
        shipping: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        billing: {
          address: {
            address_line1: "123 High St.",
            address_line2: "Flat 456",
            city: "London",
            zip: "SW1A 1AA",
            country: "GB",
          },
          phone: {
            number: "1234567890",
            country_code: "+44",
          },
        },
        risk: {
          enabled: true,
        },
        success_url: "http://localhost:3000/?status=succeeded",
        failure_url: "http://localhost:3000/?status=failed",
        metadata: {},
        processing_channel_id: "pc_anuu7qlqknnujm3olh3ajsqs5q",
        items: [
          {
            name: "Guitar",
            quantity: 1,
            unit_price: 1635,
          },
          {
            name: "Amp",
            quantity: 3,
            unit_price: 1635,
          },
        ],
      }),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

app.listen(3001, () =>
  console.log("Node server listening on port 3001: http://localhost:3001/")
);
