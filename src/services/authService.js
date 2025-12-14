import { prisma } from "../index.js";
import { passwordHelper } from "../common/helpers/password.helper.js";
import { jwtHelper } from "../common/helpers/jwt.helper.js";
import {
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from "../common/helpers/error.helper.js";

export const authService = {
    /**
     * Register new user
     */
    register: async (dataReq) => {
        const { userName, password, email } = dataReq;

        // Kiểm tra user đã tồn tại chưa
        const userExist = await prisma.users.findFirst({
            where: {
                OR: [
                    { userName: userName },
                    { email: email },
                ],
            },
        });

        if (userExist) {
            if (userExist.userName === userName) {
                throw new ConflictException("Username already exists");
            }
            if (userExist.email === email) {
                throw new ConflictException("Email already exists");
            }
        }

        // Hash password
        const hashedPassword = await passwordHelper.hash(password);

        // Tạo user mới
        const newUser = await prisma.users.create({
            data: {
                ...dataReq,
                password: hashedPassword,
            },
        });

        // Xóa password trước khi trả về
        delete newUser.password;

        return newUser;
    },

    /**
     * Login user
     */
    login: async (dataReq) => {
        const { userName, password } = dataReq;

        // Tìm user
        const user = await prisma.users.findFirst({
            where: {
                userName: userName,
            },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Kiểm tra password
        const isPasswordValid = await passwordHelper.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Xóa password trước khi tạo token
        delete user.password;

        // Tạo JWT token
        const token = jwtHelper.createToken(user);

        return token;
    },
};

