// Import the Express module and create an instance of an Express application
const express = require('express');
const app = express();

// Define a default route handler for the root URL ('/')
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Define the port number where the server will listen for requests and start the server
const port = 3000;
app.listen(port, () => {
    // Log a message to the console indicating the server is running
    console.log(`Server is running on http://localhost:${port}`);
});