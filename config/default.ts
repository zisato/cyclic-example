const config = {
  container: {
    loadModules: []
  },
  expressServer: {
    port: process.env.HTTP_PORT,
    middlewares: [
      'express.json',
      'express.cors',
    ]
  }
}

export default config
