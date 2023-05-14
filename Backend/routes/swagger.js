const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const express = require('express')
const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat Point API-Docs',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3500/'
            }
        ]
    },
    apis: ['index.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = { swaggerSpec }