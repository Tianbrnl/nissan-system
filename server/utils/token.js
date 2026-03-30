import jwt from 'jsonwebtoken';
export const createUserToken = ({ id }) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};
