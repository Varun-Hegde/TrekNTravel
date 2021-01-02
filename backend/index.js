const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

const connectDb = require('./config/db')
const {notFound,errorHandler} = require('./middlewear/errorMiddlewear')

dotenv.config()
connectDb()
const app = express()

//IMPORT ROUTES
const campgroundRoutes = require('./routes/campgroundRoutes')

//MIDDLEWEARS
app.use(express.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.get('/', (req,res) => {
    res.send("API is running")
})

//CAMPGROUND ROUTES
app.use('/api/campgrounds',campgroundRoutes)

//PAGE NOT FOUND
app.use(notFound)

//ERROR HANDLER
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))

//mongodb+srv://varun:varun@cluster0.t7npb.mongodb.net/test