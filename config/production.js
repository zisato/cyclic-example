const path = require('path');

module.exports = {
  container: {
    loadModules: {
      patterns: [
        path.join(__dirname, '..', 'build', 'src', 'infrastructure', '**', '*.js'),
        path.join(__dirname, '..', 'build', 'src', 'application', '**', '*.js')
      ]
    }
  },
  s3: {
    bucketName: process.env.CYCLIC_BUCKET_NAME
  },
}
