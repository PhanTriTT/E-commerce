const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./db/Database')
const cloudinary = require('cloudinary')
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
const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`)
})
//unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Shutting down server for ${err.message}`)
  console.log(`Shutting down server due to Unhandled promise rejection`)
  server.close(() => {
    process.exit(1)
  })
})
