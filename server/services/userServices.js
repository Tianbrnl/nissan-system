import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import { createUserToken } from "../utils/token.js";

// LOGIN USER 
export const userLoginService = async (password) => {
    try {
        if (!password) {
            return { success: false, message: "Please complete all fields" };
        }

        const user = await Users.findOne();
        if (!user) return { success: false, message: "User not found!" };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: "Wrong password!" };

        const token = createUserToken({
            id: user.id,
        });

        return {
            success: true,
            token
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

