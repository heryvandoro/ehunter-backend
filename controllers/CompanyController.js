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
        include : [ { model : db.Vacancy, include : [ { model : db.Company }, { model : db.Hunter } ] } ]
    });
    if(!company) res.send({ messages : "data not found" });
    res.send(company);
});

router.get("/:id/pendings", async (req, res) => {
    let vacancies = await db.Vacancy.findAll({
        where : { company_id : req.params.id, status : 0 }
    });
    res.send(vacancies);
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

    company.name != req.body.name ? company.name = req.body.name : "";
    company.email != req.body.email ? company.email = req.body.email : "";
    company.description != req.body.description ? company.description = req.body.description : "";
    
    if(req.body.password != undefined && req.body.password != company.password){
        let password = await bcrypt.hash(req.body.password, 10);
        company.password = password;
    }

    company = await company.save();
    res.send(company);
});

router.delete("/:id", async (req, res) => {
    let company = await db.Company.findById(req.params.id);
    if(!company) res.send({ messages : "data not found" });

    company.destroy();
    res.send({ messages : "success" });
});

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let company = await db.Company.findOne({
        where : { email : email }
    });

    if(company == null) res.send({ messages : "Wrong credentials data!" });

    bcrypt.compare(password, company.password, async function(err, result) {
        if(result) {
            res.send(company);
        } else {
            res.send({ messages : "Wrong credentials data!" });
        }
    });
});

module.exports = router;