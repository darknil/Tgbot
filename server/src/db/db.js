import 'dotenv/config'

import pkg from 'mongoose'
const { connect, connection, default: mongoose } = pkg

const dbURI = process.env.ATLAS_DB_URI
const dbName = process.env.ATLAS_DB_NAME
connect(`${dbURI}${dbName}?authSource=admin&directConnection=true`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('DATA BASE ---- OK')
  })
  .catch((error) => {
    console.error('Database connection error:', error)
  })

export default mongoose
