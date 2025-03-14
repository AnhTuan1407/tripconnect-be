import express from "express";
import profileController from "../controllers/profile.controller.js";
import { authenticated, authorize, checkOwnerProfileId } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/", authenticated, authorize("ADMIN"), profileController.getAllProfiles);
router.put("/:id", authenticated, authorize("ADMIN", "TOUR_GUIDE", "TRAVELLER"), checkOwnerProfileId, profileController.updateProfile);
router.delete("/:id", authenticated, authorize("ADMIN", "TOUR_GUIDE", "TRAVELLER"), checkOwnerProfileId, profileController.deleteProfile);
router.post("/active", authenticated, authorize("ADMIN"), profileController.activeProfile);
router.get("/:id", authenticated, authorize("ADMIN", "TOUR_GUIDE", "TRAVELLER"), checkOwnerProfileId, profileController.getProfileById);

export default router;