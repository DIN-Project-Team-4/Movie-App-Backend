const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineScope REST API',
      version: '1.0.0',
      description: 'Endpoints documentation',
      contact: {
        name: 'Indunil,Woon,Jasmine,Marco,Madhura,Upeksha,Min',
        email: 'indu.maheshi@gmail.com' // Removed the trailing comma
      },
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
    servers: [
      {
        url: `${process.env.SERVER}:${process.env.PORT}/api/v1`, // Include the base path in the URL
        description: 'CineScope REST API',
      },
    ],
  },
  apis: ['./api-docs/**.yaml'], // Path to your routes files
};
  
  const specs = swaggerJsdoc(options);
  
  const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true, withCredentials: false }));
  
    app.get('/swagger-json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });
  
    console.log(`API documentation is available at ${process.env.SERVER}:${process.env.PORT}/api-docs`);
  };
  
  module.exports = swaggerDocs