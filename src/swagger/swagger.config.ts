import swaggerJsdoc from "swagger-jsdoc";

const ThreadResponseSchema = {
  type: "object",
  properties: {
    id: { type: "integer", example: 45 },
    content: { type: "string", example: "upload banyak test" },
    image: {
      type: "string",
      description: "URL media (JSON string array jika multi-image)",
    },
    media_type: { type: "string", example: "image", nullable: true },
    user: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        username: { type: "string", example: "nippp" },
        name: { type: "string", example: "hanif ajaaaa" },
        profile_picture: {
          type: "string",
          example: "http://url.jpg",
          nullable: true,
        },
      },
    },
    created_at: { type: "string", format: "date-time" },
    likes: { type: "integer", example: 5 },
    replies: { type: "integer", example: 2 },
    islike: {
      type: "boolean",
      example: false,
      description: "Apakah user yang sedang login me-like thread ini",
    },
  },
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Circle API Documentation",
      version: "1.0.0",
      description:
        "API documentation for the Circle social media application, focusing on Thread functionalities.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: 'Otorisasi menggunakan JWT dari Cookie/Header "token".',
        },
      },
      schemas: {
        ThreadResponse: ThreadResponseSchema,
        ThreadListResponse: {
          type: "object",
          properties: {
            threads: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ThreadResponse",
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            code: { type: "integer", example: 500 },
            status: { type: "string", example: "error" },
            message: { type: "string", example: "unauthorized" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;