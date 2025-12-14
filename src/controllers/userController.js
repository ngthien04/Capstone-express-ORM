import { responseSuccess } from "../common/helpers/response.helper.js";
import { userService } from "../services/userService.js";

export const userController = {
    getUserInfo: async (req, res, next) => {
        try {
            const dataRes = await userService.getUserInfo(req.user);

            const response = responseSuccess(200, "Get user info successfully", dataRes);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    getImagesCreated: async (req, res, next) => {
        try {
            const dataRes = await userService.getImagesCreated(req.user);

            const response = responseSuccess(200, "Get created images successfully", dataRes);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    getImagesSaved: async (req, res, next) => {
        try {
            const dataRes = await userService.getImagesSaved(req.user);

            const response = responseSuccess(200, "Get saved images successfully", dataRes);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const token = await userService.updateUser(req.user, req.body);

            const response = responseSuccess(200, "User updated successfully", token);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
};

