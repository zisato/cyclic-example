const path = require('path');

module.exports = {
  container: {
    loadModules: [
      path.join(__dirname, '..', 'build', 'src', 'infrastructure', '**', '*.js')
    ]
  }
}
