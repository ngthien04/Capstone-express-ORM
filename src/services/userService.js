import { prisma } from "../index.js";
import { jwtHelper } from "../common/helpers/jwt.helper.js";

export const userService = {
    getUserInfo: async (user) => {
        return await prisma.users.findFirst({
            select: {
                userId: true,
                userName: true,
                fullName: true,
                email: true,
                phoneNumber: true,
            },
            where: {
                userId: user.userId,
            },
        });
    },

    getImagesCreated: async (user) => {
        const list = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                        fullName: true,
                    },
                },
            },
            where: {
                users_id: user.userId,
            },
        });

        const listSaved = await prisma.saved.findMany({
            where: {
                users_id: user.userId,
                isSaved: 1,
            },
        });

        return list.map((image) => {
            const isSave = listSaved.findIndex((item) => {
                if (image.imageId === item.images_id) return true;
            });
            return {
                ...image,
                saved: isSave !== -1 ? 1 : 0,
            };
        });
    },

    getImagesSaved: async (user) => {
        const result = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                        fullName: true,
                    },
                },
            },
            where: {
                saved: {
                    some: {
                        isSaved: 1,
                        users_id: user.userId,
                    },
                },
            },
        });

        return result.map((item) => {
            return {
                ...item,
                saved: 1,
            };
        });
    },

    updateUser: async (userCurrent, userInput) => {
        const dataRes = await prisma.users.update({
            where: { userId: userCurrent.userId },
            data: userInput,
        });

        delete dataRes.password;

        // Tạo token mới với thông tin đã cập nhật
        const token = jwtHelper.createToken(dataRes);

        return token;
    },
};
