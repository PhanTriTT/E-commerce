const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./db/Database')
const cloudinary = require('cloudinary')
//
const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  scopes
)

const view_id = '247200638'

async function getData() {
  await jwt.authorize()
  const result = await google.analytics('v3').data.ga.get({
    auth: jwt,
    ids: 'ga:' + view_id,
    'start-date': '30daysAgo',
    'end-date': 'today',
    metrics: 'ga:pageviews',
  })
  console.log(result)
}

getData()
//
//Handling uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`)
  console.log(`Shutting down the server for handling uncaught exception`)
})

// config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: 'backend/config/.env',
  })
}
//connect database
connectDatabase()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
//create server
const port = process.env.PORT || 4000

const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`)
})
//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down server for ${err.message}`)
  console.log(`Shutting down server due to Unhandled promise rejection`)
  server.close(() => {
    process.exit(1)
  })
})
