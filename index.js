console.clear();

const express = require('express');
const consign = require('consign');

const app = express();
const path = require('path');
const { template } = require('./src/libraries/template');

// Configuração do EJS
app.use(express.json());
app.use(express.urlencoded({
  extended: false
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