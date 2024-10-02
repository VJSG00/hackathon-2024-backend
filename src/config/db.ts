import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
//Mongodb imports
import mongoose from 'mongoose'
import colors from 'colors'
import {exit} from 'node:process'

dotenv.config()

//Le pasamos la variable de entorno de nuestro DB y el modelo de Paciente.model.ts
const db = new Sequelize(process.env.DATABASE_URL! ,{
    models: [__dirname + '/../models/**/*' ],
    logging: false
})

export default db

//mongodb
export const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.cyan.bold(`Conectado con MongoDB en: ${url}`))
    } catch(error) {
        console.log(colors.red.bold('Error al Conectar con MongoDB') )
        exit(1)
    }
}