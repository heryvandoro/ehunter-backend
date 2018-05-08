const router = require('express').Router();
const db = require("../db.js");

router.get('/', async function (req, res) {
    let hunters = await db.Hunter.findAll();
    res.send(hunters);
})

router.get('/about', function (req, res) {
    res.send('About birds');
})

module.exports = router;