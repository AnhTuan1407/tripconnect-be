import jwt from "jsonwebtoken";
import RoleModel from "../models/role.model.js";
import InvalidatedToken from "../models/invalidated.token.model.js";

export const generateToken = async (user) => {
    const role = await RoleModel.findOne({ _id: user.role });
    const token = jwt.sign(
        {
            userId: user._id,
            role: role.name,
        },
        process.env.SECRET_KEY,
        {
            algorithm: 'HS512',
            expiresIn: "1h",
        }
    );
    return token;
};

export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const isValid = await InvalidatedToken.findOne({ token: token });

        if (decoded && !isValid) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};