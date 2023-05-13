
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require('cors');
app.use(cors());

require("dotenv").config();

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});
transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});
let mailOptions = {
    // from: "test@gmail.com",
    // to: process.env.EMAIL,
    from: "aadisupersonic@gmail.com",
    to: "devip17072000@gmail.com",
    subject: "Nodemailer API",
    text: "Hi from your nodemailer API",
};

transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
        console.log("Error " + err);
    } else {
        console.log("Email sent successfully");
    }
});

app.post("/send", function (req, res) {
    console.log("hitting from send endpoint");
    let mailOptions = {
        from: "test@gmail.com",
        to: process.env.EMAIL,
        subject: "SEND: Nodemailer API",
        text: "Hi from your nodemailer API",
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
            res.json({ status: "Email sent" });
        }
    });
});
// to send by command
// curl -d -url http://localhost:3001/send
