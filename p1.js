const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'p1.html'), (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading the HTML file');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/register') {
        
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading data from data.json');
                return;
            }

            const existingData = data ? JSON.parse(data) : [];

            let tableHtml = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f7f6;
                            margin: 0;
                            padding: 0;
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                            padding: 20px;
                        }
                        table {
                            width: 80%;
                            margin: 20px auto;
                            border-collapse: collapse;
                            background-color: #fff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            border-radius: 8px;
                        }
                        th, td {
                            padding: 12px;
                            text-align: left;
                            border: 1px solid #ddd;
                        }
                        th {
                            background-color: #6a7a9b;
                            color: white;
                        }
                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }
                        tr:hover {
                            background-color: #ddd;
                        }
                        .container {
                            max-width: 1200px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .back-link {
                            display: block;
                            width: 200px;
                            margin: 20px auto;
                            padding: 10px;
                            text-align: center;
                            background-color:#463cb7;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .back-link:hover {
                            background-color:#463cb7;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Registered ID's</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>`;

            existingData.forEach(user => {
                tableHtml += `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.phone}</td>
                        <td>${user.address}</td>
                        <td>${user.gender}</td>
                    </tr>`;
            });

            tableHtml += `
                    </tbody>
                </table>
                <a href="/" class="back-link">Go Back to Home</a>
                </div>
            </body>
            </html>`;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(tableHtml);
        });
    } else if (req.method === 'POST' && req.url === '/register') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const { name, email, phone, address, gender } = userData;

                console.log('Received registration details:', userData);

                let existingData = [];
                if (fs.existsSync('data.json')) {
                    const data = fs.readFileSync('data.json', 'utf8');
                    existingData = data ? JSON.parse(data) : [];
                }

                existingData.push({ name, email, phone, address, gender });

                fs.writeFile('data.json', JSON.stringify(existingData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to data.json:', err);
                        res.statusCode = 500;
                        res.end('Error saving data');
                    } else {
                        console.log('Data successfully written to data.json');
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Registration Successful!' }));
                    }
                });
            } catch (error) {
                res.statusCode = 400;
                res.end('Invalid JSON data');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
