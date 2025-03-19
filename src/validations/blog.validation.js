import Joi from "joi";

const blogSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User id is required"
    }),
    title: Joi.string().required().max(200).messages({
        "string.empty": "Title is required",
        "string.max": "Title must not exceed 200 characters"
    }),
    content: Joi.string().required().messages({
        "string.empty": "Content is required"
    }),
    location: Joi.string().optional(),
});

export { blogSchema };
