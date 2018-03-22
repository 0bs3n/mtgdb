const express = require('express');
const pmongo = require('promised-mongo')
const db = pmongo('MTGCards', ['Cards'])
const router = express.Router();

router.get('/:name', (req, res) => {
    db.cards.find({ name: req.params.name }).then(cards => {
        cards.sort((a, b) => a.multiverseid - b.multiverseid)
        let flavor = cards.find(card => card.flavor)
        flavor = flavor ? flavor.flavor : null
        res.render('card', { cards: cards, flavor: flavor })
    })
})

module.exports = router;
