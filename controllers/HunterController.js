const router = require('express').Router();
const db = require("../db.js");
const multer = require("multer");
const path = require('path');
const XLSX = require('xlsx');
const pdfText = require('pdf-text')
const WordExtractor = require("word-extractor");
const vision = require('@google-cloud/vision');
const Storage = require('@google-cloud/storage');
const bcrypt = require('bcrypt');
const rimraf = require('rimraf');

const cloudStorage = new Storage({
    keyFilename: 'ehunter_key_google.json'
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    let hunters = await db.Hunter.findAll({
        order : [ ["id", "desc"] ],
        include : [ { model : db.Vacancy, include : [ { model : db.Company } ] } ]
    });
    res.send(hunters);
});

router.get("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id, {
        include : [ { model : db.Vacancy, include : [ { model : db.Company }, { model : db.Hunter } ] } ]
    });
    if(!hunter) res.send({ messages : "data not found" });
    res.send(hunter);
});

router.post("/", async (req, res) => {
    let password = await bcrypt.hash(req.body.password, 10);
    let hunter = await db.Hunter.create({
        name : req.body.name,
        email : req.body.email,
        password : password,
    });
    res.send(hunter);
});

router.patch("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });

    hunter.name != req.body.name ? hunter.name = req.body.name : "";
    hunter.email != req.body.email ? hunter.email = req.body.email : "";
    hunter.bio != req.body.bio ? hunter.bio = req.body.bio : "";
    
    if(req.body.password != undefined && req.body.password != hunter.password){
        let password = await bcrypt.hash(req.body.password, 10);
        hunter.password = password;
    }

    hunter = await hunter.save();
    res.send(hunter);
});

router.delete("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });

    hunter.destroy();
    res.send({ messages : "success" });
});

router.post("/:id/uploadcv", upload.single("file"), async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });

    let file = req.file;
    let file_name = file.filename;
    let ext = file_name.substr(file_name.lastIndexOf(".") + 1, 4);
    let result = "";

    await cloudStorage.bucket("ehunter").upload(file.path);
    rimraf('./uploads/*', ()=>{});

    if(["xls", "xlsx"].indexOf(ext) !== -1){
        let workbook = XLSX.readFile(file.path);
        let sheets = workbook.SheetNames;
        let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]]);
        data.forEach(d => {
            Object.keys(d).forEach(x => { result += `${d[x]} `; });
        });
    }else if(["pdf"].indexOf(ext) !== -1){
        await new Promise(function(resolve, reject){
            pdfText(file.path, function(err, chunks) {
                chunks.forEach(c => { result += `${c} `; });
                return resolve();
            });
        });
    }else if(["doc", "docx"].indexOf(ext) !== -1){
        let extractor = new WordExtractor();
        let extracted = await extractor.extract(file.path);
        result = extracted.getBody();
    }else if(["png", "jpg", "jpeg"].indexOf(ext) !== -1){
        const client = new vision.ImageAnnotatorClient({
            keyFilename: 'ehunter_key_google.json'
        });
        let text_detect = await client.textDetection(file.path);
        result = text_detect[0].fullTextAnnotation.text;
    }else{
        res.send({ messages : "format file undefined" })
    }
    result = result.replace(/\s\s+/g, ' ');
    result = result.replace(/[^\w\s]/gi, '');
    hunter.cv_raw = result;
    hunter.cv = file_name;
    await hunter.save();
    res.send(hunter);
});

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let hunter = await db.Hunter.findOne({
        where : { email : email }
    });

    if(hunter == null) res.send({ messages : "Wrong credentials data!" });

    bcrypt.compare(password, hunter.password, async function(err, result) {
        if(result) {
            res.send(hunter);
        } else {
            res.send({ messages : "Wrong credentials data!" });
        }
    });
});

module.exports = router;