const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);
module.exports.validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
    title: Joi.string().required().min(3).escapeHTML(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required().min(0).escapeHTML(),
    image: Joi.array().required(),
    location: Joi.string().min(3).required().escapeHTML(),
    deleteImages: Joi.array(),
    tags: Joi.array(),
  });
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    res.status(400);
    const message = result.error.details.map((el) => el.message).join(", ");
    throw new Error(message);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    body: Joi.string().required().min(2).escapeHTML(),
    rating: Joi.number().required().min(0).max(5),
  });
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    res.status(400);
    const message = result.error.details.map((el) => el.message).join(", ");
    throw new Error(message);
  } else {
    next();
  }
};
