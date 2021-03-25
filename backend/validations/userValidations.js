const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.validateUserSignUp = ((req,res,next) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
        username: Joi.string().required().escapeHTML()
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
        email: Joi.string().email().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
    
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