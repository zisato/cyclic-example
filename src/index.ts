import { App } from './app'

const app = new App()
app.boot()
const parameters = app.getParameters()

app.startServer(parameters.get<number>('express.port'))
