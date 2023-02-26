import express, { Request, Response, Router } from 'express'

const app = express()
const port = process.env.PORT || 3000

const router = Router()
router.get('/', (_req: Request, res: Response) => {
    res.json({'hello': 'world'})
})

app.use(router)

app.listen(port, () => {
    console.log(`Server start in port ${port}`)
})
