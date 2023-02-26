import path from 'path'

const config = {
  container: {
    loadModules: [
      'src/infrastructure/**/*.ts',
      'src/application/**/*.ts'
    ]
  },
  expressServer: {
    port: process.env.HTTP_PORT,
    middlewares: [
      'express.json',
      'express.cors',
      {
        'express.static': {
          dir: path.join(__dirname, '..', '..', 'public')
        }
      }
    ]
  }
}

export default config
