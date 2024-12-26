const http = require('http');//import builtin http module
const fs = require('fs');//import built in file system module
const path = require('path');//manipulating file and directory paths(jese isme hamne p1.html import ki)

const port = 3000;//(server running on port 3000)

//create server and req and res handles the incomming request and send respone
const server = http.createServer((req, res) => {
    //if we are using GET(for getting data from server) && requested url is root or home page /
    if (req.method === 'GET' && req.url === '/') {
        //reads the data of file p1.html that contain data of home page
        fs.readFile(path.join(__dirname, 'p1.html'), //checks if there is error 
        (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading the HTML file');//error dikhayega 
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');//opens p1.html
            res.end(data);
        });

    } 
    //if root is /register 
    else if (req.method === 'GET' && req.url === '/register') {
        //read data.json and The second argument specifies the encoding used to interpret the contents of the file. 'utf8' ensures the file is read as a string rather than raw binary data.
        fs.readFile('data.json', 'utf8', (err, data) =>
             {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading data from data.json');//error -agr nhi h data file
                return;
            }
 
            const existingData = data ? JSON.parse(data) : [];//error agr nhi to ye html code extract krega data or displau info

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
                            background-color:#6a7a9b;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .back-link:hover {
                            background-color:#5c6a79;
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
                <a href="/" class="back-link ">Go Back to Home</a>
                </div>
            </body>
            </html>`;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(tableHtml);
        });
    } else if (req.method === 'POST' && req.url === '/register') {
        let body = '';//data jo ayega woh ye empty string mai store hoga

        req.on('data', chunk => {
            body += chunk;//data bar bar append hora
        });
        //req end hogi
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const { name, email, phone, address, gender } = userData;

                console.log('Received registration details:', userData);

                let existingData = [];
                if (fs.existsSync('data.json')) {//scyn=synchronous ki pehle ek task complete hothenext
                    const data = fs.readFileSync('data.json', 'utf8');
                    existingData = data ? JSON.parse(data) : [];
                }//JSON.parse(data) convert json string into javascript object

                existingData.push({ name, email, phone, address, gender });//push data in file
              //stringfy: js ka object ko json ke string mai krne k leye
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
//start erver
server.listen(port, () => {
    console.log(Server is running on http://localhost:${port});
});
