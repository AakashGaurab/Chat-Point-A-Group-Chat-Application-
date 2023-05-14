const connection = require("./config/db.js");
const mongoose = require("mongoose")
const express = require("express");
const { user } = require("./routes/user")
const { admin } = require("./routes/admin")
const cors = require("cors");
const app = express();

// Implementing swagger-documentation
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat Point API-Docs',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://chatpointbackend2-production-56db.up.railway.app/'
      }
    ]
  },
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(cors({ origin: "*" }))

app.use(express.json());

app.use("/admin", admin);

app.use("/user", user)

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
