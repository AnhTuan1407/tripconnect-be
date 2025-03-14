import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/token.util.js";
import Profile from "../models/profile.model.js";

export const authorize = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    message: "You do not have permission to perform this action.",
                });
            }
            return next();
        } catch (error) {
            console.error("Authorize Middleware Error:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    };
};

export const authenticated = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthenticated.",
            });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        req.user = decoded;
        return next();
    } catch (error) {
        console.error("Authenticated Middleware Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export const checkOwnerUserId = async (req, res, next) => {
    try {
        if (req.user.role === "ADMIN") {
            return next();
        }

        const user = await User.findOne({ _id: req.params.id });

        if (!user || user._id.toString() !== req.user.userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const checkOwnerProfileId = async (req, res, next) => {
    try {
        if (req.user.role === "ADMIN") {
            return next();
        }

        const profile = await Profile.findOne({ _id: req.params.id });

        if (!profile || profile.userId.toString() !== req.user.userId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }

        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
