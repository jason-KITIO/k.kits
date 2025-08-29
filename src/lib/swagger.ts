import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: "app/api", // dossier des routes API
    definition: {
      // informations globales pour Swagger
      openapi: "3.0.0",
      info: {
        title: "API Next.js Exemple",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });
};
