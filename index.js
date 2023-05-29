console.clear();
const express = require('express');
const consign = require('consign');

const app = express();
const path = require('path');

// Configuração do EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static('node_modules'));

consign()
  .include('src/routes')
  .then('src/libraries')
  .into(app);

app.listen(3285, () => {
  console.log('Server started on port 3285');
});

app.get('*', function (req, res) {
  res.status(404).render('errors/404');
});

app.locals.formHelpers = require(path.join(__dirname, 'src/helpers/formHelpers'));