const WebSocket = require('ws');

let wss;

function init(app, host, port) {    
    // Set WebSocket port to be one greater than the HTTP port 
    wsPort = parseInt(port) + 1;

    // Use app.listen directly from Express to initialize WebSocket server
    const server = app.listen(wsPort, () => {
        console.log(`WebSocket listening on ws://${host}:${wsPort}`);    });

    // Initialize WebSocket server
    wss = new WebSocket.Server({ server });

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        ws.send(JSON.stringify({ type: 'connected' }));
    });
}

module.exports = init;