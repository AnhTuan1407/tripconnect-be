import express from "express";
import blogController from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);

export default router;