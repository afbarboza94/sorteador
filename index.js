console.clear();

const { app: electronApp, Tray, shell, Menu, nativeImage } = require('electron');

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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para arquivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'img', 'favicon.ico')));

consign({
  cwd: __dirname
})
  .include('src/routes')
  .then('src/libraries')
  .into(app);

const port = 3285;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);

  let tray;
  electronApp.whenReady().then(() => {
    const openBrowser = () => {
      const baseUrl = `http://localhost:${port}`;
      shell.openExternal(baseUrl);
    };

    openBrowser();

    tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'public', 'img', 'favicon.ico')));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Abrir Navegador', click: () => openBrowser() },
      {
        label: 'Reiniciar', click: () => {
          electronApp.relaunch();
          electronApp.exit();
        }
      },
      { type: 'separator' },
      { label: 'Fechar', click: () => electronApp.quit() },
    ]);
    tray.setToolTip('Configurações do servidor do Sorteador.');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      setTimeout(() => {
        tray.popUpContextMenu();
      }, 100);
    });
  });
});

app.locals.formHelpers = require(path.join(__dirname, 'src/helpers/formHelpers'));

app.get('*', function (req, res) {
  template(res, "errors/404");
});