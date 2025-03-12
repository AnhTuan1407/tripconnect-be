import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import { comparePassword } from "../utils/password.util.js";
import { generateToken, verifyToken } from "../utils/token.util.js";
import InvalidatedToken from "../models/invalidated.token.model.js";
import admin from "../configs/firebase.admin.config.js";
import jwt from "jsonwebtoken";
import Role from "../enums/role.enum.js";


class AuthenticationController {

    //[POST] auth/token
    async token(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username: username });

            if (!user)
                return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Username does not exist." });

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid)
                return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Wrong password." });

            const token = await generateToken(user);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Authentication successful.",
                token: token,
            });

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }

    //[POST] auth/introspect
    async introspect(req, res) {
        try {
            const { token } = req.body;

            const isValid = await verifyToken(token);

            if (isValid) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Valid Token.",
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Invalid Token.",
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }

    //[POST] auth/logout
    async logout(req, res) {
        try {
            const invalidToken = {
                token: req.body.token
            };

            await InvalidatedToken.create(invalidToken);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Logout successfully.",
            });

        } catch (error) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }

    //[POST] /auth/google
    async google(req, res) {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            const decode = decodedToken;

            console.log(decode);


            // let user = await User.findOne({ email });
            // if (!user) {
            //     const username = email.split("@")[0];
            //     const role = Role.TRAVELLER;
            //     user = new User({ email, username, role });
            //     await user.save();
            // }

            // const jwtToken = generateToken(user);

            // res.json({ success: true, token: jwtToken });
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            res.status(401).json({ success: false, message: "Invalid token", error });
        }
    }

    //[POST] /auth/test
    async test(req, res) {
        try {
            const result = req.body;
            res.json(result);
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            res.status(401).json({ success: false, message: "Invalid token", error });
        }
    }
};

export default new AuthenticationController;