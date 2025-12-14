import { responseSuccess } from "../common/helpers/response.helper.js";
import { authService } from "../services/authService.js";

export const authController = {
    /**
     * Register new user
     */
    register: async (req, res, next) => {
        try {
            const { userName, fullName, password, email, phoneNumber } = req.body;

            const dataRes = await authService.register({
                userName,
                fullName,
                password,
                email,
                phoneNumber,
            });

            const response = responseSuccess(200, "User registered successfully", dataRes);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Login user
     */
    login: async (req, res, next) => {
        try {
            const { userName, password } = req.body;

            const token = await authService.login({ userName, password });

            const response = responseSuccess(200, "Login successful", token);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
};

