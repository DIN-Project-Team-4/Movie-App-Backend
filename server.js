require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerDocs = require('./swagger');
const path = require('path');


const PORT = process.env.PORT || 3001;

const app = express(); // Create an instance of Express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.text({ limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

const corsOrigin ={
  origin:'http://localhost:3000', 
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));

// Default response to a root request for both get and post
app.all("/", (req, res) => {
  const htmlString = 
    `<html>
      <head>
        <title>cineScope REST API's</title>
      </head>
      <body>
        <center>
          <h1>cineScope</h1>
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
app.use('/',routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
 const error = new Error('Resource not found') 
  return next(error);
});

// Error handling 
app.use((err, req, res, next) => {
  if (err.message === 'Resource not found'){
    res.status(404).json({ error: "Resource not found", errorDetails: err.message });
  } else {
    res.status(500).json({ error: "Something went wrong", errorDetails: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`cineScope API server listens on port ${PORT}`);   
})


