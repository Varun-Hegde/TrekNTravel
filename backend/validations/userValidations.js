const Joi = require('joi');

module.exports.validateUserSignUp = ((req,res,next) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        username: Joi.string().required()
    })
    const result = userSchema.validate(req.body)
    if(result.error){
        res.status(400)
        const message = result.error.details.map(el => el.message).join(', ')
        throw new Error(message)
    }else{
        next();
    }
}) 

module.exports.validateUserSignIn = ((req,res,next) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    
    })
    const result = userSchema.validate(req.body)
    if(result.error){
        res.status(400)
        const message = result.error.details.map(el => el.message).join(', ')
        throw new Error(message)
    }else{
        next();
    }
}) 