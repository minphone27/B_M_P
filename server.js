const express = require("express");

const mongoose = require("mongoose");

const Cors = require("cors");

const path = require("path")

const helmet = require("helmet");

const morgan = require("morgan");

require("dotenv").config();

//app initiated

const app = express();
const PORT = process.env.PORT || 3000


//middlewares
app.use(express.json())

app.use(Cors(
    {
        origin:"http://localhost:8080",
        methods: ["GET" , "PUT" , "POST"]
    }
));

app.use(helmet());

app.use(morgan("tiny"));


//Routes



//render image
app.use("/upload",express.static(path.join(__dirname, "upload")));

mongoose.connect("mongodb://localhost:27017/B_M_P").then(()=>{
    console.log("database connected");
    app.listen(PORT,()=>{
        console.log("server is up and running")
    });
});



