const Joi = require('joi')

module.exports.validateCampground = ((req,res,next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required().min(3),
        price: Joi.number().min(0).required(),
        description: Joi.string().required().min(0),
        image: Joi.array().required(),
        location: Joi.string().min(3).required(),
        deleteImages : Joi.array()
    })
    const result = campgroundSchema.validate(req.body)
    if(result.error){
        res.status(400)
        const message = result.error.details.map(el => el.message).join(', ')
        throw new Error(message)
    }else{
        next();
    }
}) 

module.exports.validateReview = ((req,res,next) => {
    const reviewSchema = Joi.object({
        body : Joi.string().required().min(2),
        rating : Joi.number().required().min(1).max(5)
    })
    const result = reviewSchema.validate(req.body)
    if(result.error){
        res.status(400)
        const message = result.error.details.map(el => el.message).join(', ')
        throw new Error(message)
    }else{
        next();
    }
})