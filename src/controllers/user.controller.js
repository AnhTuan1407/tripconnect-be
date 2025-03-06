import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import User from "../models/user.model.js";
import RoleModel from "../models/role.model.js";
import Role from "../enums/role.enum.js";

class UserController {

    //[POST] /api/users
    async createUser(req, res) {
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
    }


};

export default new UserController;