import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import routers from "./routers/index.js";
import swaggerSpec from "./common/swagger/init.swagger.js";
import { PrismaClient } from "@prisma/client";
import { APP_CONFIG } from "./common/constants/app.constant.js";
import { handleError } from "./common/helpers/error.helper.js";

const app = express();

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static("."));
app.use("/public", express.static("public"));

// Prisma Client
export const prisma = new PrismaClient();

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/pinterest", routers);

// Global error handler
app.use(handleError);

// Start server
const port = APP_CONFIG.PORT;
const server = app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger UI available at http://localhost:${port}/docs`);
    console.log(`API Base URL: http://localhost:${port}/api/pinterest`);
});
