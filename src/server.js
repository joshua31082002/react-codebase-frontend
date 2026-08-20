import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 4173

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Health API listening on port ${port}`)
})
