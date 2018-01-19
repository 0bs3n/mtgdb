const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    let errors = null
    if (req.session.errors) {
        errors = req.session.errors
        req.session.errors = null
        console.log("\nsession errors: ")
        console.log(JSON.stringify(errors, undefined, 2))
    }
    res.render('filter', { errors: errors })
    req.session.errors = null
});

module.exports = router;
