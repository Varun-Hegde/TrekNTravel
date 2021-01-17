const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
    }
})

UserSchema.pre('save',async function(next){
    try{
        
        //GENERATE A SALT
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }catch(err){
        next(err);
    }
})

UserSchema.methods.isValidPassword = async function(newPassword) {
    try{
       return await bcrypt.compare(newPassword,this.password)
    }catch(error){
        throw new Error(error)
    }
}


const User = mongoose.model('User',UserSchema)

module.exports = User