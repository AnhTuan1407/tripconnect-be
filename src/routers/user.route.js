import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticated, authorize, checkOwnerId } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/traveller", userController.travellerRegister);
router.get("", authenticated, authorize("ADMIN"), userController.getAllUsers);
router.put("/:id", authenticated, authorize("ADMIN", "TRAVELLER", "TOUR_GUIDE"), checkOwnerId, userController.updateUser);
router.get("/:id", authenticated, authorize("ADMIN", "TRAVELLER", "TOUR_GUIDE"), checkOwnerId, userController.findUserById);

export default router;
