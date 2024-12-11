require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./swagger');
const path = require('path');
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express(); // Create an instance of Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.text({ limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

const corsOrigin = {
    origin: process.env.CORS_ALLOW_ORIGIN || 'https://cinescope-frontend.onrender.com',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin));

// Default response to a root request for both get and post
app.all("/", (req, res) => {
    const htmlString =
        `<html>
      <head>
        <title>CineScope REST API's</title>
      </head>
      <body>
        <center>
          <h1>CineScope</h1>
          <hr />
          <br />
          <br/>
          <br/>
        </center>
      </body>
    </html>`;

    // Send the HTML string as the response
    res.status(404).send(htmlString);
});

//Swagger
swaggerDocs(app);

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const error = new Error('Resource not found')
    return next(error);
});

// Error handling 
app.use((err, req, res, next) => {
    if (err.message === 'Resource not found') {
        res.status(404).json({ error: "Resource not found", errorDetails: err.message });
    } else {
        res.status(500).json({ error: "Something went wrong", errorDetails: err.message });
    }
});

if (process.env.SSL_ENABLE == "TRUE") {
    //Create a server certificate before enabling SSL
    //openssl req -nodes -new -x509 -keyout server.key -out server.cert

    if (!fs.existsSync(process.env.SSL_KEY_PATH) || !fs.existsSync(process.env.SSL_CERT_PATH)) {
        console.error(`HTTPS server not started. SSL key or certificate file is missing.
            Key: ${process.env.SSL_KEY_PATH}
            Cert: ${process.env.SSL_CERT_PATH}`);
        return
    }

    const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };

    https.createServer(options, app).listen(process.env.SSL_PORT, () => {
        console.log(`Secure server running on https://localhost:${process.env.SSL_PORT}`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`CineScope API server listens on port ${PORT}`);
    })
}


/* Database Connection Test of Madura

//To Check Database Connection
const { dbConnection } = require('./repository/connectionDatabase');

(async () => {
  try {
    const pool = dbConnection();
    const result = await pool.query('SELECT NOW() AS current_time');
    console.log("Database connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("Database connection test failed:", error.message);
  }
})();

*/