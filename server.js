const dotenv = require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path'
const app = express();

// setting middleware
app.use(morgan("dev"));

app.use(cors({
    origin: '*',
    method: "*"
}));

app.use('/uploads', express.static(path.join(__dirname, 'upload')));

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 100000 }));

routes(app);

let port = process.env.NODE_PORT || 5001;

app.listen(port, () => console.log('Server running on http://localhost:' + port + '/'));