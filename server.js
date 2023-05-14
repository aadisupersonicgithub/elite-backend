
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");
require("dotenv").config();

// const { testAzureConnection } = require("./server2");

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


const upload = multer({ dest: 'uploads/' }); // Specify the directory to store uploaded files


const key = process.env.KEY;
const containerName = process.env.CONTAINER;
// const blobServiceClient = new BlobServiceClient(key);
// const containerClient = blobServiceClient.getContainerClient(name);
// console.log(containerClient, blobServiceClient)
const { BlobServiceClient } = require("@azure/storage-blob");

async function putOnAzure(file) {
    //   const connectionString = "<your-connection-string>"; // Replace with your actual connection string

    const blobServiceClient = BlobServiceClient.fromConnectionString(key);
    //   const containerName = "<your-container-name>"; // Replace with your actual container name

    const filePath = file.path ? file.path : "./power.mp4"
    // const filePath = "./dummy.txt"
    const fileContent = fs.readFileSync(filePath);
    const fileName = file.originalname ? file.originalname : "power.mp4"

    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const response = await containerClient.exists();
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        if (response) {
            console.log("Azure Blob Storage connection successful!");
            const uploadResponse = await blockBlobClient.upload(fileContent, fileContent.length);
            console.log(uploadResponse)
        } else {
            console.log(`Container '${containerName}' does not exist.`);
        }
    } catch (error) {
        console.error("Error testing Azure Blob Storage connection:", error);
    }
}
app.post('/upload', upload.single('video'), (req, res) => {
    // Handle the uploaded file here
    console.log('Received file:', req.file);
    putOnAzure(req.file);

    // Perform additional processing (e.g., save the file to Azure Blob Storage)

    res.send('File uploaded successfully!');
});