const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const https = require("https");
const multer  = require('multer')
const { spawn }  = require('child_process');
var storage = multer.diskStorage(
    {
        destination: './public/uploads/',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname+".wav");
        }
    }
);
var upload = multer( { storage: storage } );


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
    if (req.file) {
        console.log('Uploaded: ', req.file);
        var address= "/public/uploads/"+req.file.filename;
        var change = spawn('python3', [__dirname+"/public/code/change.py",address]);
        // var listElement = document.getElementById(req.file.filename);

        change.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            res.json({
                status:"success",
                name: "done!!",
                random: "ok"
            })
        });
          
        change.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
          
        change.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
      }
});

app.route("/result")
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    // console.log("yi");
    next();
})
.post((req,res,next)=>{
    console.log(req)

});


const server = http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});