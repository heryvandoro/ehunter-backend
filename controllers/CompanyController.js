const router = require('express').Router();
const db = require("../db.js");

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
    let company = await db.Company.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        description : req.body.description
    });
    res.send(company);
});

router.patch("/:id", async (req, res) => {
    let company = await db.Company.findById(req.params.id);
    if(!company) res.send({ messages : "data not found" });
    
    company.name = req.body.name;
    company.email = req.body.email;
    company.password = req.body.password;
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