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
          Lifetime.SINGLETON
        ],
        [
          path.join(__dirname, '..', 'src', 'infrastructure', 'category', 'repository', 'in-memory-category-repository.ts'),
          Lifetime.SINGLETON
        ],
        [
          path.join(__dirname, '..', 'src', 'infrastructure', 'store', 'repository', 'in-memory-store-repository.ts'),
          Lifetime.SINGLETON
        ]
      ]
    }
  },
  expressServer: {
    port: Math.floor(Math.random() * 9000 + 1000),
  }
}

export default config
