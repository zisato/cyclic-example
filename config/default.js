const path = require('path');

module.exports = {
  container: {
    loadModules: {
      patterns: [],
      lifetime: 'SCOPED',
      injectionMode: 'CLASSIC'
    }
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
    ],
    errorHandlers: [
      'appErrorHandlerMiddleware'
    ]
  }
}
