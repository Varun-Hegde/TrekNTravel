const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useCreateIndex:true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false 
        })
        console.log("Connected to database");
    }catch(err){
        console.log(`Error ${err.message}`);
        process.exit(1);
    }   
}

module.exports = connectDB

//mongodb+srv://varun:varun@cluster0.t7npb.mongodb.net/test