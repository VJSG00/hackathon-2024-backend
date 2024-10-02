import {exit} from 'node:process'
import db from '../config/db'

//Este codigo elimina los elementos creados por la base de datos durante el testing
const clearDB = async () => {
    try {
        await db.sync({force:true})
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

//Esto habilita el codigo "npm run db" para borrar los datos del db.
if(process.argv[2] === '--clear'){
    clearDB()
}

// Para ver los comandos de node que tenemos disponibles 
// console.log(process.argv)