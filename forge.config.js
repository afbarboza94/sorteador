const path = require('path');

module.exports = {
  packagerConfig: {
    icon: `./public/img/favicon.ico`,
    win32metadata: {
      FileDescription: 'Sorteador',
    },
    ignore: [
      path.resolve(__dirname, 'src/database'),
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://sunfarms.com.br/images/favicon.ico',
        title: 'Sorteador',
        setupIcon: path.resolve(__dirname, `public/img/favicon.ico`),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
