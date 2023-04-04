const express = require("express")
const connection = require("./config/database")
const graderRouter = require("./routes/graderRouter")
const authRouter = require("./routes/authRoute")
    // const authGrader = require("./routes/authGrader")
const cors = require("cors")

const app = express()


connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connection successful")
    }
})


const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST'],
    credentials: true

}

app.use(express.json())
app.use(cors(corsOptions));

app.use("/", graderRouter)
app.use("/", authRouter)
    // app.use("/", authGrader)









app.listen(3001, (err) => {
    console.log("app is listening on port 3001")
})