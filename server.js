const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Setup server port
const port = process.env.PORT || 5000;

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the root route!');
});

// Use employee router for requests starting with /employees
const employeeRoutes = require('./routes/employee.routes');
app.use('/api/v1/employees', employeeRoutes);

// Use user router for requests starting with /users
const userRoutes = require('./routes/user.routes');
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

