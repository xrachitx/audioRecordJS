const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const multer  = require('multer')
const upload  = multer({ dest: 'uploads/' })

const hostname = "localhost";
const port = 5000;

const app = express();

app.use(bodyParser.json())

app.use(express.static(__dirname+"/public/"));
app.route("/")
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    // console.log("yi");
    next();
})
.get((req,res,next)=>{
    console.log("hi");
    res.sendFile(__dirname+"/public/index.html")
    // next()
})
.post(upload.single("file"),(req,res,next)=>{
    // var file = req.file;
    if (req.file) {
        console.log('Uploaded: ', req.file);
        // Homework: Upload file to S3
      }
    // if (!file){
    //     const error = new Error("No file uploaded.")
    //     error.statusCode = 400;
    //     return next(error);
    // }
    // res.sendFile(file);
    // console.log("hello")
    // console.log(req.file)
});
// app.use(express.static(__dirname+"/public/js"));


const server = http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});