import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pinterest Clone API",
      version: "1.0.0",
      description: "API documentation for Pinterest Backend - Capstone Express ORM",
      contact: {
        name: "API Support",
        email: "thien@example.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:5000/api/pinterest",
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            userId: {
              type: "integer",
              example: 1,
            },
            userName: {
              type: "string",
              example: "thien",
            },
            fullName: {
              type: "string",
              example: "Thien",
            },
            email: {
              type: "string",
              example: "thien@example.com",
            },
            phoneNumber: {
              type: "string",
              example: "0123456789",
            },
          },
        },
        Image: {
          type: "object",
          properties: {
            imageId: {
              type: "integer",
              example: 1,
            },
            imageName: {
              type: "string",
              example: "Beautiful Sunset",
            },
            imageUrl: {
              type: "string",
              example: "1698330938418_image.jpg",
            },
            users_id: {
              type: "integer",
              example: 1,
            },
            saved: {
              type: "integer",
              example: 0,
              description: "0 = not saved, 1 = saved",
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            commentId: {
              type: "integer",
              example: 1,
            },
            content: {
              type: "string",
              example: "This is a great image!",
            },
            users_id: {
              type: "integer",
              example: 1,
            },
            images_id: {
              type: "integer",
              example: 1,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "Error",
            },
            code: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routers/*.js", "./src/routers/**/*.js"], // Đường dẫn đến các file chứa JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

