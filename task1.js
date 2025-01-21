const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    const logDetails = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        protocol: req.protocol,
        hostname: req.hostname,
        query: req.query,
        headers: req.headers,
        userAgent: req.get('User-Agent')
    };

    const logString = JSON.stringify(logDetails);

    const logFilePath = path.join(__dirname, 'requests.log');
    const MAX_LOG_SIZE = 1 * 1024 * 1024; 

    fs.stat(logFilePath, (err, stats) => {
        if (!err && stats && stats.size >= MAX_LOG_SIZE) {
            const rotatedLog = `requests_${Date.now()}.log`;
            fs.rename(logFilePath, path.join(__dirname, rotatedLog), (err) => {
                if (err) console.error('Failed to rotate log file:', err);
            });
        }
    });

    fs.appendFile(logFilePath, logString + '\n', (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });

    next(); 
});

app.get('/', (req, res) => {
    res.send('Welcome to the Express.js server!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
