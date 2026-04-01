import Users from "../models/User.js";
import bcrypt from 'bcrypt';
import { createUserToken } from "../utils/token.js";
import { validatePassword } from "../utils/inputValidators.js";

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

// CHANGE PASSWORD
export const changePasswordService = async (
    currentPassword,
    newPassword,
    confirmPassword
) => {
    try {
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return { success: false, message: "Please complete all fields" };
        }

        const user = await Users.findOne();
        if (!user) return { success: false, message: "User not found!" };

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return { success: false, message: "Wrong password!" };

        if (newPassword !== confirmPassword) {
            return { success: false, message: "New password and confirm password do not match!" };
        }

        if (validatePassword(newPassword)) {
            return {
                success: false,
                message: `Password must:
                    • Be at least 8 characters long
                    • Include at least one uppercase letter
                    • Include at least one lowercase letter
                    • Include at least one number
                    • Include at least one special character`
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return {
            success: true,
            message: "Password changed successfully!"
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

