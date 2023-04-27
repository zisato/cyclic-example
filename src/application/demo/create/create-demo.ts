import { CategoryRepository } from '../../../domain/category/repository/category-repository'
import { CreateCategoryService } from '../../../domain/category/service/create-category-service'
import { ProductRepository } from '../../../domain/product/repository/product-repository'
import { CreateProductService } from '../../../domain/product/service/create-product-service'
import { StoreRepository } from '../../../domain/store/repository/store-repository'
import { CreateStoreService } from '../../../domain/store/service/create-store-service'
import { SellerRepository } from '../../../domain/seller/repository/seller-repository'
import { CreateSellerService } from '../../../domain/seller/service/create-seller-service'
import { CreateDemoCommand } from './create-demo-command'
import { CustomerRepository } from '../../../domain/customer/repository/customer-repository'
import { CreateCustomerService } from '../../../domain/customer/service/create-customer-service'
import { UuidV1 } from '../../../infrastructure/identity/uuid-v1'
import { Identity } from '../../../domain/identity/identity'

export default class CreateDemo {
    static readonly FIXTURES = {
        seller: {
            id: '8b7dc116-cf10-11ed-afa1-0242ac120002',
            name: 'Seller Demo',
        },
        store: {
            id: '9005d3ea-cf10-11ed-afa1-0242ac120002',
            name: 'Store Demo',
            sellerId: '8b7dc116-cf10-11ed-afa1-0242ac120002'
        },
        customer: {
            id: '6223a60c-e2eb-11ed-b5ea-0242ac120002',
            name: 'Customer Demo'
        },
        categories: [
            {
                id: 'a02ab6a0-cf10-11ed-afa1-0242ac120002',
                name: 'Spray'
            }
        ],
        products: [
            {
                id: 'b0a77e96-cf10-11ed-afa1-0242ac120002',
                name: 'Negro',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: 'e56746ce-d0ce-11ed-afa1-0242ac120002',
                name: 'Blanco',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '08abd8fc-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Claro',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '0c3dab80-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Marcasita',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '0f2d0174-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Galena',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '12efc468-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Pirita',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '17e8377a-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Antracita',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            },
            {
                id: '1afa8cce-d0cf-11ed-afa1-0242ac120002',
                name: 'Griss Eterno',
                categoryId: 'a02ab6a0-cf10-11ed-afa1-0242ac120002'
            }
        ]
    }

    constructor (
        private readonly sellerRepository: SellerRepository,
        private readonly storeRepository: StoreRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async execute (_command: CreateDemoCommand): Promise<void> {
        await this.createSeller(new UuidV1(CreateDemo.FIXTURES.seller.id), CreateDemo.FIXTURES.seller.name)

        await this.createStore(new UuidV1(CreateDemo.FIXTURES.store.id), CreateDemo.FIXTURES.store.name, new UuidV1(CreateDemo.FIXTURES.store.sellerId))

        await this.createCustomer(new UuidV1(CreateDemo.FIXTURES.customer.id), CreateDemo.FIXTURES.customer.name)

        for (const category of CreateDemo.FIXTURES.categories) {
            await this.createCategory(new UuidV1(category.id), category.name)
        }

        for (const product of CreateDemo.FIXTURES.products) {
            await this.createProduct(new UuidV1(product.id), product.name, new UuidV1(product.categoryId), new UuidV1(CreateDemo.FIXTURES.store.id))
        }
    }

    private async createSeller(sellerId: Identity, sellerName: string): Promise<void> {
        const service = new CreateSellerService(this.sellerRepository)

        await service.create(sellerId, sellerName)
    }

    private async createStore(storeId: Identity, storeName: string, sellerId: Identity): Promise<void> {
        const service = new CreateStoreService(this.storeRepository, this.sellerRepository)

        await service.create(storeId, storeName, sellerId)
    }

    private async createCustomer(customerId: Identity, customerName: string): Promise<void> {
        const service = new CreateCustomerService(this.customerRepository)

        await service.create(customerId, customerName)
    }

    private async createCategory(categoryId: Identity, categoryName: string): Promise<void> {
        const service = new CreateCategoryService(this.categoryRepository)

        await service.create(categoryId, categoryName)
    }

    private async createProduct(productId: Identity, productName: string, categoryId: Identity, storeId: Identity): Promise<void> {
        const service = new CreateProductService(this.productRepository, this.categoryRepository, this.storeRepository)

        await service.create(productId, productName, categoryId, storeId)
    }
}
