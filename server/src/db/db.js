import 'dotenv/config'

import pkg from 'mongoose'
const { connect, connection, default: mongoose } = pkg

connect(`${process.env.dbURI}${process.env.dbName}`, {})
  .then(() => {
    console.log('DATA BASE ---- OK')
  })
  .catch((error) => {
    console.error('Database connection error:', error)
  })

export default mongoose
