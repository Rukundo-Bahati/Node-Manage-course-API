const config = require("config");
const express = require("express");
const debug = require("debug")("app");
const bodyParser = require("body-parser");
const connection = require("./db");
const student = require("./controllers/students");
const course = require("./controllers/courses");
const options = require("./swagger.json");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express");
const auth = require("./controllers/auth");
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.json())

// Routes for students and courses
app.use("/api/student", student);
app.use("/api/course", course);
app.use("/api/auth", auth);
app.use("/api/-docs", swaggerUI.serve, swaggerUI.setup(options));

const PORT = process.env.PORT || 5400;
app.listen(PORT, () => debug(`Is running on port ${PORT}`));
