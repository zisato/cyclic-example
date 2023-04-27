const path = require('path');

module.exports = {
  container: {
    injectionMode: 'CLASSIC',
    loadModules: {
      patterns: [],
      lifetime: 'SCOPED',
      injectionMode: 'CLASSIC'
    }
  },
  express: {
    port: process.env.HTTP_PORT,
    middlewares: {
      static: {
        dir: path.join(__dirname, '..', 'public')
      }
    },
    viewEngine: {
      views: path.join(__dirname, '..', 'src', 'views/handlebars'),
      layoutsDir: path.join(__dirname, '..', 'src', 'views/handlebars/layouts')
    }
  }
}
