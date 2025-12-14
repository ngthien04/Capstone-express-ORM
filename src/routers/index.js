import express from "express";
import authRouter from "./auth.router.js";
import userRouter from "./userRouter.js";
import imageRouter from "./imageRouter.js";
import { middleware } from "../middlewares/middleware.js";

const routers = express.Router();

/**
 * @swagger
 * /api/pinterest/welcome:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 */
routers.get("/welcome", (req, res) => 
    res.status(200).json("Welcome Api Capstone-express-ORM")
);

// Auth routes (public)
routers.use("/auth", authRouter);

// User routes (protected)
routers.use("/user", userRouter);

// Image routes
routers.use("/image", imageRouter);

// 404 handler
routers.all("*", (req, res, next) => 
    res.status(404).json({ 
        status: "Fail",
        code: 404,
        message: `Can't find ${req.originalUrl} on this server!`,
        data: null
    })
);

// Error handler
routers.use(middleware.errorHandle);

export default routers;

