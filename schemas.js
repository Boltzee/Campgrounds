const Joi = require("joi");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escepeHTML": "{{#label}} must include HTML!",
	},
	rules: {
		escepeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error("string.escepeHTML", { value });
				return clean;
			},
		},
	},
});

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().required().min(0),
		// image: Joi.string().required(),
		location: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
