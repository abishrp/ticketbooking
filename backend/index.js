// At the very top of your main server file (e.g., app.js or index.js)
require('dotenv').config();


const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser");
const userRoute =require("./routes/usersRoute")

const db = require("./config/database")
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

app.use("/user",userRoute)



db.usersDb.sync().then(
    app.listen(process.env.PORT,()=>
        {
            console.log("port",process.env.PORT);
        })
)
