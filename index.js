console.clear();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const consign = require('consign');

const app = express();
const path = require('path');
const { template } = require('./src/libraries/template');

// Configuração do EJS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

app.use(cookieParser());
app.use(session({
  secret: 'sorteador',
  saveUninitialized: false,
  resave: false
}));

app.set('/views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para arquivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static('node_modules'));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'img', 'favicon.ico')));

consign()
  .include('src/routes')
  .then('src/libraries')
  .into(app);

app.listen(3285, () => {
  console.log('Server started on port 3285');
});

app.locals.formHelpers = require(path.join(__dirname, 'src/helpers/formHelpers'));

app.get('*', function (req, res) {
  template(res, "errors/404");
});