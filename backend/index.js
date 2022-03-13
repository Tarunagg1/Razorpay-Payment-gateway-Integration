require('dotenv').config();
const express = require('express');
const cors = require("cors");
const fs = require('fs');

const shortid = require("shortid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_DEV_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET_DEV_KEY,
});


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.send("jiuhuh")
})

app.post("/razorpay", async (req, res) => {
    const payment_capture = 1;
    const amount = 499;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.log(error);
    }
});

// hooks
app.post('/verification', (req, res) => {
    const secret = "123456789";
    console.log(req.body);

    const crypto = require('crypto');
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        // request is legit
        console.log('pass');
        fs.writeFileSync('payment1.json', JSON.stringify(req.body, null, 4));
    } else {
        // request mismatch
        console.log('missmatch');
    }
    return res.status(200).json({ status: 'ok' })
})


app.listen(process.env.PORT, () => {
    console.log('server listening on port ' + process.env.PORT);
})
