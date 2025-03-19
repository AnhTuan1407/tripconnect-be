import express from "express";
import postController from "../controllers/post.controller.js";
import upload from '../middlewares/multer.middleware.js';
import { authenticated, authorize, checkOwnerPost } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/", authenticated, upload.array("images"), postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", authenticated, upload.array("images"), checkOwnerPost, postController.updatePost);
router.delete("/:id", authenticated, checkOwnerPost, postController.deletePost);
router.post("/like", authenticated, authorize("TOUR_GUIDE", "TRAVELER"), postController.likePost);
router.post("/privacy/:id", authenticated, authorize("TOUR_GUIDE", "TRAVELER"), checkOwnerPost, postController.setPrivacy);

export default router;