// import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
const fs = require("fs");
const key = "DefaultEndpointsProtocol=https;AccountName=sampledatafordeproject;AccountKey=8kaB2Utxg93oCR5VnSp8TDrTLbZYTljvG+PDA9YRiWnSbmANyZO6QZKtUJS79dixAq2NBjxxHBGR+ASteoZucg==;BlobEndpoint=https://sampledatafordeproject.blob.core.windows.net/;QueueEndpoint=https://sampledatafordeproject.queue.core.windows.net/;TableEndpoint=https://sampledatafordeproject.table.core.windows.net/;FileEndpoint=https://sampledatafordeproject.file.core.windows.net/;";
const containerName = "website-data";
// const blobServiceClient = new BlobServiceClient(key);
// const containerClient = blobServiceClient.getContainerClient(name);
// console.log(containerClient, blobServiceClient)
const { BlobServiceClient } = require("@azure/storage-blob");

async function testAzureConnection() {
    //   const connectionString = "<your-connection-string>"; // Replace with your actual connection string

    const blobServiceClient = BlobServiceClient.fromConnectionString(key);
    //   const containerName = "<your-container-name>"; // Replace with your actual container name

    const filePath = "./power.mp4"
    // const filePath = "./dummy.txt"
    const fileContent = fs.readFileSync(filePath);
    const fileName = "power.mp4"

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

testAzureConnection();