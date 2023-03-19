import { Lifetime } from 'awilix'
import path from 'path'

const config = {
  container: {
    loadModules: {
      patterns: [
        path.join(__dirname, '..', 'src', 'infrastructure', '**', '*.ts'),
        path.join(__dirname, '..', 'src', 'application', '**', '*.ts'),
        [
          path.join(__dirname, '..', 'src', 'infrastructure', 'product', 'repository', 'in-memory-product-repository.ts'),
          {
            lifetime: Lifetime.SINGLETON
          }
        ]
      ]
    }
  },
  expressServer: {
    port: Math.floor(Math.random() * 9000 + 1000),
  }
}

export default config
