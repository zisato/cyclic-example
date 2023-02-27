const path = require('path');

module.exports = {
  container: {
    loadModules: []
  },
  expressServer: {
    port: process.env.HTTP_PORT,
    middlewares: [
      'express.cors',
      'express.json',
      {
        'express.static': {
          dir: path.join(__dirname, '..', 'public')
        }
      }
    ]
  }
}
