import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: "Pacientes",
                description: "API operations related to patients"
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Patients'
        }
    },
    apis: ['./src/router.ts']
}
const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec