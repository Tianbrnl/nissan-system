import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import { createUserToken } from "../utils/token.js";

// LOGIN USER 
export const userLoginService = async (email, password) => {
    try {
        if (!email || !password) {
            return { success: false, message: "Please complete all fields" };
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) return { success: false, message: "Wrong email or password!" };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: "Wrong email or password!" };

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

