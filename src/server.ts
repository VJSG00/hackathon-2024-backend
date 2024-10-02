import express from 'express'
import router from './routes/router'
import db from './config/db'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
//import SwaggerUi from 'swagger-ui-express'
//import swaggerSpec from './config/swagger'
import dotenv from 'dotenv'
// Login Register and Auth
import newRouter from './routes/router'
import Dashrouter from './controllers/DashBoards/Dashboard1'

import newAuthRouter from './routes/AuthRouter'
import AuthRouter from './routes/AuthRouter'

//Variables de entorno para cors.
dotenv.config()

//conexión con la base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        await db.sync()
        console.log(colors.cyan('Conexion exitosa con la base de datos'))
    } catch (error) {
        console.log( colors.red.bold('Hubo un error al conectar con la DB'))
    }
}

connectDB()

// Instancia de Express - configuración del servidor
const server = express()

// Cors
const corsConfig : CorsOptions = {

    origin: function(origin, callback) {
        
        const whitelist = [process.env.FRONTEND_URL]
        
        if (process.argv[2] === '--api') {
            whitelist.push(undefined)
        }
        if(whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsConfig))


// Leer datos de Formularios
server.use(express.json());

// Logger
server.use(morgan('dev'));

//Rutas
//Router descontinuado
server.use('/api', router)

//Router de Autenticación
server.use('/api/auth', AuthRouter)

//Router de Roles
server.use('/api', newRouter)
//Router de Dashboard - TODO: Separar en Ruta y Controlador
server.use('/api', Dashrouter)




//Documentación
//server.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec))

// Login Register and Auth
//server.use('/api/auth', authRoutes)

//Esto era una prueba para el testing, que tambien está comentado.
// server.use('/api', (req, res) => {
//     res.json({msg: 'Api funcionando'})
// })



export default server