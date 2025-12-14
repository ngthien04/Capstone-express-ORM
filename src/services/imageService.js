import { prisma } from "../index.js";
import { fileHelper } from "../common/helpers/file.helper.js";
import { NotFoundException } from "../common/helpers/error.helper.js";

export const imageService = {
    getList: async (dataReq) => {
        if (!dataReq.isLogin) {
            const listImage = await prisma.images.findMany({
                include: {
                    users: {
                        select: {
                            userName: true,
                            fullName: true,
                        },
                    },
                },
            });
            return listImage.map((item) => {
                return { ...item, saved: 0 };
            });
        }

        if (dataReq.isLogin) {
            const list = await prisma.images.findMany({
                include: {
                    users: {
                        select: {
                            userName: true,
                            fullName: true,
                        },
                    },
                },
            });
            
            const listSaved = await prisma.saved.findMany({
                where: {
                    users_id: dataReq.user.userId,
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
        }
    },

    search: async (dataReq) => {
        if (dataReq.isLogin) {
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
                    imageName: {
                        contains: dataReq.searchText,
                    },
                },
            });

            const listSaved = await prisma.saved.findMany({
                where: {
                    users_id: dataReq.user.userId,
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
        }

        if (!dataReq.isLogin) {
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
                    imageName: {
                        contains: dataReq.searchText,
                    },
                },
            });

            return result.map((image) => {
                return {
                    ...image,
                    saved: 0,
                };
            });
        }
    },

    getImageInfo: async (dataReq) => {
        if (dataReq.isLogin) {
            const imageExist = await prisma.images.findFirst({
                include: {
                    users: {
                        select: {
                            userName: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
                where: {
                    imageId: dataReq.imageId,
                },
            });

            if (!imageExist) {
                throw new NotFoundException("Image not found");
            }

            const savedExist = await prisma.saved.findFirst({
                where: {
                    AND: {
                        images_id: dataReq.imageId,
                        users_id: dataReq.user.userId,
                    },
                },
            });

            return {
                ...imageExist,
                saved: savedExist?.isSaved || 0,
            };
        }

        if (!dataReq.isLogin) {
            const imageExist = await prisma.images.findFirst({
                include: {
                    users: {
                        select: {
                            userName: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
                where: {
                    imageId: dataReq.imageId,
                },
            });

            if (!imageExist) {
                throw new NotFoundException("Image not found");
            }

            return {
                ...imageExist,
                saved: 0,
            };
        }
    },

    createComment: async (dataReq) => {
        const data = {
            content: dataReq.content,
            users_id: dataReq.user.userId,
            images_id: dataReq.imageId,
        };

        return await prisma.comments.create({ data });
    },

    getComment: async (imageId) => {
        return await prisma.comments.findMany({
            where: {
                images_id: imageId,
            },
            include: {
                users: {
                    select: {
                        userName: true,
                        fullName: true,
                    },
                },
            },
            orderBy: {
                commentId: 'desc',
            },
        });
    },

    getSave: async (dataReq) => {
        const imageExist = await prisma.images.findFirst({ 
            where: { imageId: dataReq.imageId } 
        });
        
        if (!imageExist) {
            throw Object.assign(new Error("Image Not Found"), { status: 404 });
        }

        const savedExist = await prisma.saved.findFirst({
            where: {
                AND: {
                    images_id: dataReq.imageId,
                    users_id: dataReq.user.userId,
                },
            },
        });

        return savedExist || { isSaved: 0 };
    },

    saveAndUnSave: async (dataReq) => {
        const imageExist = await prisma.images.findFirst({ 
            where: { imageId: dataReq.imageId } 
        });
        
        if (!imageExist) {
            throw Object.assign(new Error("Image Not Found"), { status: 404 });
        }

        const savedExist = await prisma.saved.findFirst({
            where: {
                AND: {
                    images_id: dataReq.imageId,
                    users_id: dataReq.user.userId,
                },
            },
        });

        // Nếu đã tồn tại => save hoặc unsave
        if (savedExist) {
            return await prisma.saved.update({
                where: {
                    users_id_images_id: {
                        images_id: dataReq.imageId,
                        users_id: dataReq.user.userId,
                    },
                },
                data: { isSaved: savedExist.isSaved === 1 ? 0 : 1 },
            });
        }

        // Nếu chưa tồn tại => tạo mới (default = save)
        if (!savedExist) {
            const data = {
                isSaved: 1,
                users_id: dataReq.user.userId,
                images_id: dataReq.imageId,
            };
            return await prisma.saved.create({ data });
        }
    },

    deleteImage: async (dataReq) => {
        const imageExist = await prisma.images.findFirst({
            where: {
                imageId: dataReq.imageId,
                users_id: dataReq.user.userId,
            },
        });

        if (!imageExist) {
            throw new NotFoundException("Image not found or you don't have permission to delete");
        }

        // Xóa file ảnh từ server
        if (imageExist.imageUrl) {
            fileHelper.deleteFile(imageExist.imageUrl);
        }

        return await prisma.images.delete({
            where: {
                imageId: dataReq.imageId,
            },
        });
    },

    createImage: async (dataReq) => {
        const fileName = fileHelper.saveImage(dataReq.file);

        const data = {
            imageName: dataReq.imageName,
            imageUrl: fileName,
            users_id: dataReq.user.userId,
        };

        return await prisma.images.create({
            data,
            include: {
                users: {
                    select: {
                        userName: true,
                        fullName: true,
                    },
                },
            },
        });
    },
};

