const router = require('express').Router();
const db = require("../db.js");

router.post("/", async (req, res) => {
    let task = await db.Task.create({
        vacancy_id : req.body.vacancy_id,
        criteria : JSON.stringify(req.body.criteria)
    });
    let vacancy = await db.Vacancy.findById(req.body.vacancy_id);
    vacancy.status = 1;
    await vacancy.save();
    res.send(task);
});

module.exports = router;