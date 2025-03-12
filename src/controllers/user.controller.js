import { StatusCodes } from "http-status-codes";
import Role from "../enums/role.enum.js";
import RoleModel from "../models/role.model.js";
import User from "../models/user.model.js";
import { hashPassword } from "../utils/password.util.js";
import { mongooseToObject, multipleMongooseToObject } from "../utils/convertObject.util.js";

class UserController {

    //[POST] /api/v1/users/traveller
    async travellerRegister(req, res) {
        try {
            const { fullName, email, password, phoneNumber } = req.body;

            const username = email.split('@')[0];

            const exitsUser = await User.findOne({ $or: [{ email }, { phoneNumber }] })

            if (exitsUser) {
                const errors = [];

                if (exitsUser.email == email)
                    errors.push("Email already exist.")
                if (exitsUser.phoneNumber == phoneNumber)
                    errors.push("Phone number already exist.")

                return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: errors });
            }

            const travellerRole = await RoleModel.findOne({ name: Role.TRAVELLER });

            if (!travellerRole)
                return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Role not found." });

            const userCreated = {
                fullName: fullName,
                email: email,
                username: username,
                password: await hashPassword(password),
                phoneNumber: phoneNumber,
                role: travellerRole._id
            }

            await User.create(userCreated);

            return res.status(StatusCodes.OK).json({ success: true, message: "User created successfully" });
        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    };

    // [GET] /api/v1/users?page=x&limit=x
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const users = await User.find().select("-password").skip(skip).limit(limit);

            if (!users)
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "No user information found."
                });

            const totalUsers = await User.countDocuments();

            return res.status(StatusCodes.OK).json({
                success: true,
                result: {
                    totalUsers: totalUsers,
                    totalPage: Math.ceil(totalUsers / limit),
                    currentPage: page,
                    limit: limit,
                    data: users
                },
            });

        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    };

    // [PUT] /api/v1/users/:id
    async updateUser(req, res) {
        try {
            const { fullName, email, phoneNumber, address, bio, profilePicture } = req.body;

            const id = req.params.id;

            const user = await User.findOne({ _id: id });
            if (!user)
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "User not found.",
                });

            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.address = address || user.address;
            user.bio = bio || user.bio;
            user.profilePicture = profilePicture || user.profilePicture;

            await user.save();

            return res.json({
                success: true,
                message: "User updated successfully.",
                result: user,
            });
        } catch (error) {
            console.log(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    };

    // [GET] /api/v1/users/:id
    async findUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findOne({ _id: id });

            if (!user)
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "User not found.",
                });

            return res.status(StatusCodes.OK).json({
                success: true,
                result: user,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
    };
};

export default new UserController;