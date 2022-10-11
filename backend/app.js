const express = require('express')
const app = express()
const cors = require('cors')
const ErrorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(fileUpload({ useTempFiles: true }))

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'backend/config/.env',
  })
}
//Route imports
const user = require('./routes/UserRoute')
const product = require('./routes/ProductRoute')
const order = require('./routes/OrderRoute')
const payment = require('./routes/PaymentRoute')
app.use('/api/v2', product)
app.use('/api/v2', user)
app.use('/api/v2', order)
app.use('/api/v2', payment)

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
})

//it's for error handling
app.use(ErrorHandler)
module.exports = app
