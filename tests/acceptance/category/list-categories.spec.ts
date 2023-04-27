import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'

describe('List Categories acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/categories'

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('express.port'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  describe('GET method', () => {
    test('When valid request returns 200 status code', async () => {
      // When
      const response = await request(server).get(route).send()
  
      // Then
      const expectedStatusCode = 200
      expect(response.statusCode).toEqual(expectedStatusCode)
    })
  })
})
