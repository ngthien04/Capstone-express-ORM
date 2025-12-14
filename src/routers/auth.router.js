import express from "express";
import { authController } from "../controllers/authController.js";
import { middleware } from "../middlewares/middleware.js";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/pinterest/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *               - email
 *               - phoneNumber
 *               - fullName
 *             properties:
 *               userName:
 *                 type: string
 *                 example: thien
 *               password:
 *                 type: string
 *                 example: password123
 *               email:
 *                 type: string
 *                 example: thien@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "0123456789"
 *               fullName:
 *                 type: string
 *                 example: Thien
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
authRouter.post("/register", middleware.checkRegisterRequest, authController.register);

/**
 * @swagger
 * /api/pinterest/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: thien
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/login", middleware.checkLoginRequest, authController.login);

export default authRouter;

