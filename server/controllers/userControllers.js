import { userLoginService } from "../services/userServices.js";
import { cookieOptions } from "../utils/cookie.js";

// LOGIN USER
export const userLoginController = async (req, res) => {
    try {
        const { password } = req.body;
        
        const result = await userLoginService(password);

        if (!result.success) {
            return res.json(result)
        }

        res.cookie('userToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// LOGOUT USER
export const logoutUserController = (req, res) => {
    res.clearCookie('userToken', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
};

// FETCH USER
export const fetchUserController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.json({
                success: false,
                user: null
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            user: null,
            message: error.message
        });
    }
};