const router = require('express').Router();
const db = require("../db.js");

router.get("/", async (req, res) => {
    let vacancies = await db.Vacancy.findAll();
    res.send(vacancies);
});

router.get("/:id", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id);
    if(!vacancy) res.send({ messages : "data not found" });
    res.send(vacancy);
});

router.post("/", async (req, res) => {
    let vacancy = await db.Vacancy.create({
        company_id : req.body.company_id,
        position_name : req.body.position_name,
        salary_start : req.body.salary_start,
        salary_end : req.body.salary_end,
        description : req.body.description
    });
    res.send(vacancy);
});

router.patch("/:id", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id);
    if(!vacancy) res.send({ messages : "data not found" });
    
    vacancy.company_id = req.body.company_id;
    vacancy.position_name = req.body.position_name;
    vacancy.salary_start = req.body.salary_start;
    vacancy.salary_end = req.body.salary_end;
    vacancy.description = req.body.description;

    vacancy = await vacancy.save();
    res.send(vacancy);
});

router.delete("/:id", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id);
    if(!vacancy) res.send({ messages : "data not found" });

    vacancy.destroy();
    res.send({ messages : "success" });
});

module.exports = router;