import { userRegistrationService } from "../services/userServices.js";

// REGISTER USER 
export const userRegistrationController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userRegistrationService(email, password);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// // LOGIN USER
// export const userLoginController = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const result = await userLoginService(email, password);

//         if (!result.success) {
//             return res.json(result)
//         }

//         res.cookie('userToken', result.token, cookieOptions);

//         return res.json({
//             success: true,
//             message: "Login successful"
//         });

//     } catch (error) {
//         console.error(error);

//         return res.json({
//             success: false,
//             message: error.message
//         });
//     }
// }