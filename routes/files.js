
const router = require("express").Router()
const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const Grid = require("gridfs-stream")
const GridFsStorage = require("multer-gridfs-storage")
const connectDb = require("../config/db");
const mongoose = require("mongoose")

// db calling :--
let conn = mongoose.createConnection(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })


// grid fs stream:-
let gfs;
conn.once('open', () => {
    // init strem
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads")
    // all set!
})

// create store :--
var storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// post request 
// the action shoud be "/upload" & method="post" & enctype="multipart/form-data" and fildname name="file"

router.post("/upload", upload.single("file"), (req, res) => {
    res.json({
        status: 200,
        msg: "file uploaded"
    })
})

// getting files 

router.get("/", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            res.json({
                status: 400,
                msg: "no files exist"
            })
        } else {
            res.json(files)
        }
    })
})

// get file by filename
router.get("/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, files) => {
        if (!files || files.length === 0) {
            res.json({
                status: 400,
                msg: "no files exist"
            })
        } else {
            if (files.contentType === "image/jpeg" || files.contentType === "image/png" || files.contentType === "application/pdf") {
                const readstream = gfs.createReadStream(files.filename);
                readstream.pipe(res);
            } else {
                res.json({
                    status: 400,
                    msg: "that is not a img"
                })
            }
        }
    })
})


module.exports = router