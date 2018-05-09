const router = require('express').Router();
const db = require("../db.js");

router.get("/", async (req, res) => {
    let categories = await db.Category.findAll({ hierarchy: true });
    res.send(categories);
});

router.get("/:id", async (req, res) => {
    let category = await db.Category.findOne({
        where : { id: req.params.id },
        include: [
            { model: db.Category, as: 'childrens', hierarchy : true },
            { model: db.Category, as: 'parents'},
        ]
    });
    if(!category) res.send({ messages : "data not found" });
    res.send(category);
});

module.exports = router;