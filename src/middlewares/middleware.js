import { prisma } from "../index.js";
import { jwtHelper } from "../common/helpers/jwt.helper.js";
import { fileHelper } from "../common/helpers/file.helper.js";
import { responseSuccess } from "../common/helpers/response.helper.js";
import {
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from "../common/helpers/error.helper.js";
import multer, { diskStorage } from "multer";
import path from "path";
import { UPLOAD_CONFIG } from "../common/constants/app.constant.js";

export const middleware = {
    /**
     * Error handling middleware
     * handleError từ common/helpers/error.helper.js
     */
    errorHandle: (err, req, res, next) => {
        const statusCode = err.code || err.status || 500;
        const message = err.message || "Internal Server Error";

        const response = {
            status: statusCode >= 400 && statusCode < 500 ? "Fail" : "Error",
            code: statusCode,
            message: message,
            data: null,
            links: {
                docs: "https://doc.com/api",
            },
        };

        res.status(statusCode).json(response);
    },

    /**
     * Protect route - Yêu cầu authentication
     */
    protect: async (req, res, next) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken || !accessToken.startsWith("Bearer ")) {
                throw new UnauthorizedException("Not enough permissions. Please provide a valid token.");
            }

            const token = accessToken.split(" ")[1];
            if (!token || token === "null") {
                throw new UnauthorizedException("Invalid token format.");
            }

            let decodedToken;
            try {
                decodedToken = jwtHelper.verifyToken(token);
            } catch (error) {
                if (error.message === "jwt expired") {
                    throw new UnauthorizedException("Token has expired. Please login again.");
                }
                throw new UnauthorizedException("Invalid token.");
            }

            const user = await prisma.users.findFirst({
                where: {
                    userId: decodedToken.userId,
                },
            });

            if (!user) {
                throw new NotFoundException("User not found.");
            }

            // Xóa password trước khi gán vào req
            delete user.password;

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    },

    /**
     * Optional login 
     */
    isLogin: (req, res, next) => {
        const accessToken = req.headers.authorization;

        if (!accessToken || !accessToken.startsWith("Bearer ")) {
            req.isLogin = false;
            return next();
        }

        const token = accessToken.split(" ")[1];
        if (token === "null" || !token) {
            req.isLogin = false;
            return next();
        }

        try {
            req.user = jwtHelper.decodeToken(token);
            req.isLogin = true;
        } catch (error) {
            req.isLogin = false;
        }
        next();
    },

    /**
     * Validation middleware - Login request
     */
    checkLoginRequest: (req, res, next) => {
        if (!req.body.userName) {
            return res.status(400).json(
                responseSuccess(400, "Invalid username", null)
            );
        }

        if (!req.body.password) {
            return res.status(400).json(
                responseSuccess(400, "Invalid password", null)
            );
        }

        next();
    },

    /**
     * Validation middleware - Register request
     */
    checkRegisterRequest: (req, res, next) => {
        const { userName, password, email, phoneNumber, fullName } = req.body;

        if (!userName) {
            return res.status(400).json(
                responseSuccess(400, "Invalid userName", null)
            );
        }
        if (!password) {
            return res.status(400).json(
                responseSuccess(400, "Invalid password", null)
            );
        }
        if (!email) {
            return res.status(400).json(
                responseSuccess(400, "Invalid email", null)
            );
        }
        if (!phoneNumber) {
            return res.status(400).json(
                responseSuccess(400, "Invalid phone number", null)
            );
        }
        if (!fullName) {
            return res.status(400).json(
                responseSuccess(400, "Invalid fullname", null)
            );
        }

        next();
    },

    /**
     * Validation middleware - Comment request
     */
    checkCommentRequest: (req, res, next) => {
        if (!req.body.imageId) {
            return res.status(400).json(
                responseSuccess(400, "Invalid imageId", null)
            );
        }
        if (!req.body.content || req.body.content.trim() === "") {
            return res.status(400).json(
                responseSuccess(400, "Invalid content", null)
            );
        }

        next();
    },

    /**
     * Validation middleware - Create image request
     */
    checkCreateImageRequest: (req, res, next) => {
        if (!req.file) {
            return res.status(400).json(
                responseSuccess(400, "Invalid file. Please upload an image.", null)
            );
        }

        // Kiểm tra file type
        if (!fileHelper.isValidFileType(req.file.mimetype)) {
            return res.status(400).json(
                responseSuccess(400, "Invalid file type. Only images are allowed.", null)
            );
        }

        // Kiểm tra file size
        if (!fileHelper.isValidFileSize(req.file.size)) {
            return res.status(400).json(
                responseSuccess(400, `File size cannot exceed ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1000000}MB`, null)
            );
        }

        if (!req.body.imageName || req.body.imageName.trim() === "") {
            return res.status(400).json(
                responseSuccess(400, "Invalid imageName", null)
            );
        }

        next();
    },

    /**
     * Multer upload configuration
     */
    upload: () => {
        const imgUploadDir = path.join(process.cwd(), UPLOAD_CONFIG.UPLOAD_DIR);
        
        const storage = diskStorage({
            destination: imgUploadDir,
            filename: (req, file, callback) => {
                const timestamp = new Date().getTime();
                callback(null, `${timestamp}_${file.originalname}`);
            },
        });

        return multer({
            storage: storage,
            limits: {
                fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
            },
        });
    },
};
