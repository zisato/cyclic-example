
import { Server } from 'http'
import request from 'supertest'
import { App } from '../../src/app'

describe('Index acceptance test', () => {
  const route = '/'
  let server: Server | null = null
  const app = new App()

  beforeAll(async () => {
    server = await app.startServer()
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  test('When valid request returns 200 status code', async () => {
    // When
    const response = await request(server).get(route).send()

    // Then
    expect(response.statusCode).toEqual(200)
  })

  test('When valid request returns response body', async () => {
    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedResponseBody = { hello: 'world' }
    expect(response.body).toEqual(expectedResponseBody)
  })
})
