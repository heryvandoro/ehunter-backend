const router = require('express').Router();
const db = require("../db.js");

router.get("/", async (req, res) => {
    let hunters = await db.Hunter.findAll();
    res.send(hunters);
});

router.get("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });
    res.send(hunter);
});

router.post("/", async (req, res) => {
    let hunter = await db.Hunter.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        cv : req.body.cv,
        cv_raw : req.body.cv_raw
    });
    res.send(hunter);
});

router.patch("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });
    
    hunter.name = req.body.name;
    hunter.email = req.body.email;
    hunter.password = req.body.password;
    hunter.cv = req.body.cv;
    hunter.cv_raw = req.body.cv_raw;

    hunter = await hunter.save();
    res.send(hunter);
});

router.delete("/:id", async (req, res) => {
    let hunter = await db.Hunter.findById(req.params.id);
    if(!hunter) res.send({ messages : "data not found" });

    hunter.destroy();
    res.send({ messages : "success" });
});

module.exports = router;