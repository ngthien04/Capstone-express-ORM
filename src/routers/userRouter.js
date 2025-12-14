import express from "express";
import { userController } from "../controllers/userController.js";
import { middleware } from "../middlewares/middleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/pinterest/user:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/", middleware.protect, userController.getUserInfo);

/**
 * @swagger
 * /api/pinterest/user/images-created:
 *   get:
 *     summary: Get images created by current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of created images
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/images-created", middleware.protect, userController.getImagesCreated);

/**
 * @swagger
 * /api/pinterest/user/images-saved:
 *   get:
 *     summary: Get images saved by current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved images
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/images-saved", middleware.protect, userController.getImagesSaved);

/**
 * @swagger
 * /api/pinterest/user/update:
 *   put:
 *     summary: Update current user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully, returns new JWT token
 *       401:
 *         description: Unauthorized
 */
userRouter.put("/update", middleware.protect, userController.updateUser);

export default userRouter;

