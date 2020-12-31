import express from 'express';
import bodyParser from 'body-parser';
import handler from './handler';

const app = express();
app.use(bodyParser.json());

app.post('/', handler);

app.listen(3000);
