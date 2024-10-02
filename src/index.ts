//npm run dev
import server from "./server";
import colors from 'colors'

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log( colors.blue(`Rest Api en el puerto ${port}` ))
})