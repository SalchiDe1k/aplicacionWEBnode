// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const routes = require('./routes');
const db = require('./db');

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'mysecretkey', resave: true, saveUninitialized: true }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor http://localhost:${port}`);
});
