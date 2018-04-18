const express = require('express');
const pmongo = require('promised-mongo')
const db = pmongo('MTGCards', ['cards'])
const router = express.Router();

router.get('/:name', (req, res) => {
    db.cards.find({ name: req.params.name }).then(cards => {
        cards.sort((a, b) => a.multiverseid - b.multiverseid)
        let flavor = cards.find(card => card.flavor)
        flavor = flavor ? flavor.flavor : null
        db.Decks.find(
            { 
                "maindeck.name": { $in: [ cards[0].name ]}, 
                $nor: [ { format: "commander" }, { format: "commander_1v1"} ]
            }).then(decks => {
            decks.sort((a, b) => b.metaPercentage - a.metaPercentage)
            res.render('card', { 
                    cards: cards, 
                    flavor: flavor, 
                    decks: decks.slice(0, 10),
                })
        })
    })
})

module.exports = router;
