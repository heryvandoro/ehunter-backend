const router = require('express').Router();
const db = require("../db.js");
const multer = require("multer");
const path = require('path');

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
        include : [ { model : db.Vacancy, include : [ { model : db.Company } ] } ]
    });
    if(!hunter) res.send({ messages : "data not found" });
    res.send(hunter);
});

router.post("/", async (req, res) => {
    let hunter = await db.Hunter.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    });
    res.send(hunter);
});

router.patch("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });
    
    hunter.name = req.body.name;
    hunter.email = req.body.email;
    hunter.password = req.body.password;

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

    console.log(req.files);
    res.sendStatus(200);
});

module.exports = router;