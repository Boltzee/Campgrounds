const baseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escepeHTML": "{{#label}} must not include HTML!",
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

const Joi = baseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escepeHTML(),
		price: Joi.number().required().min(0),
		// image: Joi.string().required(),
		location: Joi.string().required().escepeHTML(),
		description: Joi.string().required().escepeHTML(),
	}).required(),
	deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required().escepeHTML(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
