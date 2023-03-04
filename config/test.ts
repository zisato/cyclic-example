import path from "path"

const config = {
  container: {
    loadModules: [
      path.join(__dirname, '..', 'src', 'infrastructure', '**', '*.ts')
    ]
  },
  expressServer: {
    port: Math.floor(Math.random() * 9000 + 1000),
  }
}

export default config
