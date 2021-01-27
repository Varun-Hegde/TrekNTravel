const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize');

const connectDb = require('./config/db')
const {notFound,errorHandler} = require('./middlewear/errorMiddlewear')

dotenv.config()
connectDb()
const app = express()

//IMPORT ROUTES
const campgroundRoutes = require('./routes/campgroundRoutes')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

//MIDDLEWEARS
app.use(express.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(cookieParser())
/* app.use(passport.initialize()) */
//FOR storing uploaded files locally:
//app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
//Prevent Mongo Injections
app.use(mongoSanitize({
  replaceWith: '_'
}))


//ROUTES
app.get('/', (req,res) => {
    res.send("API is running")
})

//CAMPGROUND ROUTES
app.use('/api/campgrounds',campgroundRoutes)

//CAMPGROUND ROUTES
app.use('/api/users',userRoutes)

//UPLOAD ROUTES
app.use('/api/upload',uploadRoutes)


//PAGE NOT FOUND
app.use(notFound)

//ERROR HANDLER
app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))