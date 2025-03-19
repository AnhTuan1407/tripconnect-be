import { StatusCodes } from "http-status-codes";
import Blog from "../models/post.model.js";
import { blogSchema } from "../validations/blog.validation.js";

class BlogController {

    // [POST] /api/v1/blogs
    async createBlog(req, res) {
        try {
            const { userId, title, content, location } = req.body;

            const { error: errors } = blogSchema.validate(
                { userId, title, content },
                { abortEarly: false }
            );

            if (errors) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: errors.details.map(err => err.message)
                })
            }

            const newBlog = {
                userId: userId,
                title: title,
                content: content,
                location: location
            }

            await Blog.create(newBlog);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Post blog successfully"
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

    // [GET] /api/v1/blogs
    async getAllBlogs(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const blogs = await Blog.find().skip(skip).limit(limit);;

            const totalBlogs = await Blog.countDocuments();
            return res.status(StatusCodes.OK).json({
                success: true,
                result: {
                    totalBlogs: totalBlogs,
                    totalPage: Math.ceil(totalBlogs / limit),
                    currentPage: page,
                    limit: limit,
                    data: blogs
                },
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error
            })
        }
    }

    // [GET] /api/v1/blogs/:id
    async getBlogById(req, res) {
        try {

        } catch (error) {

        }
    }

    // [PUT] /api/v1/blogs/:id
    async updateBlog(req, res) {
        try {

        } catch (error) {

        }
    }

    // [DELETE] /api/v1/blogs
    async deleteBlog(req, res) {
        try {

        } catch (error) {

        }
    }


}

export default new BlogController;