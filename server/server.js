import express from 'express'
export class ExpressServer {
  constructor(port) {
    this.app = express()
    this.startServer(port)
  }
  startServer(port) {
    const PORT = port || 4000
    this.app.listen(PORT, async () => {
      console.log(`Server started on port ${PORT}`)
      console.log(`Server URL: http://localhost:${PORT}`)
    })
  }
}
