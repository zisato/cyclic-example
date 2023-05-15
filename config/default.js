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
  s3: {
    bucketName: 'default-bucket-name',
    endpoint: 'http://localstack:4566',
    forcePathStyle: true
  },
  dynamodb: {
    endpoint: 'http://localstack:4566'
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
      layoutsDir: path.join(__dirname, '..', 'src', 'views/handlebars/layouts'),
      partialsDir: [
        path.join(__dirname, '..', 'src', 'views/handlebars/partials'),
        path.join(__dirname, '..', 'src', 'views/handlebars/admin/partials')
      ]
    }
  }
}
