const router = require('express').Router();
const db = require("../db.js");
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
    let companies = await db.Company.findAll({
        order : [ ["id", "desc"] ],
        include : [ { model : db.Vacancy } ]
    });
    res.send(companies);
});

router.get("/:id", async (req, res) => {
    let company = await db.Company.findById(req.params.id, {
        include : [ { model : db.Vacancy } ]
    });
    if(!company) res.send({ messages : "data not found" });
    res.send(company);
});

router.post("/", async (req, res) => {
    let password = await bcrypt.hash(req.body.password, 10);
    let company = await db.Company.create({
        name : req.body.name,
        email : req.body.email,
        password : password
    });
    res.send(company);
});

router.patch("/:id", async (req, res) => {
    let company = await db.Company.findById(req.params.id);
    if(!company) res.send({ messages : "data not found" });
    
    let password = await bcrypt.hash(req.body.password, 10);
    company.name = req.body.name;
    company.email = req.body.email;
    company.password = password;
    company.description = req.body.description;

    company = await company.save();
    res.send(company);
});

router.delete("/:id", async (req, res) => {
    let company = await db.Company.findById(req.params.id);
    if(!company) res.send({ messages : "data not found" });

    company.destroy();
    res.send({ messages : "success" });
});

module.exports = router;