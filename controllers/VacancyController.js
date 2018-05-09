const router = require('express').Router();
const db = require("../db.js");

router.get("/", async (req, res) => {
    let vacancies = await db.Vacancy.findAll({
        include : [ { model : db.Requirement }, { model : db.Hunter }, { model : db.Company } ]
    });
    res.send(vacancies);
});

router.get("/:id", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id, {
        include : [ { model : db.Requirement }, { model : db.Hunter }, { model : db.Company } ]
    });
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

    let requirements = req.body.requirements;
    let promises = [];
    requirements.forEach(requirement => {
        let prom = db.Requirement.create({
            vacancy_id : vacancy.id,
            text : requirement
        });
        promises.push(prom);
    });
    await Promise.all(promises);
    
    vacancy = await db.Vacancy.findById(vacancy.id, {
        include : [ { model : db.Requirement } ]
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

    await db.Requirement.destroy({ where : { vacancy_id : req.params.id } });

    let requirements = req.body.requirements;
    let promises = [];
    requirements.forEach(requirement => {
        let prom = db.Requirement.create({
            vacancy_id : vacancy.id,
            text : requirement
        });
        promises.push(prom);
    });
    await Promise.all(promises);
    
    vacancy = await db.Vacancy.findById(req.params.id, {
        include : [ { model : db.Requirement } ]
    });

    res.send(vacancy);
});

router.post("/:id/apply", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id);
    if(!vacancy) res.send({ messages : "data not found" });

    let apply = await db.HunterVacancy.create({
        hunter_id : req.body.hunter_id,
        vacancy_id : vacancy.id 
    });
    res.send({ messages : "success" });
});

router.delete("/:id", async (req, res) => {
    let vacancy = await db.Vacancy.findById(req.params.id);
    if(!vacancy) res.send({ messages : "data not found" });

    vacancy.destroy();
    res.send({ messages : "success" });
});

module.exports = router;