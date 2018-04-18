const express = require('express');
const pmongo = require('promised-mongo')
const ObjectId = pmongo.ObjectId
const db = pmongo('MTGCards', ['cards'])
const router = express.Router();

router.get('/:deckId', (req, res) => {
    db.Decks.findOne({ "_id": ObjectId(req.params.deckId)}).then(deck => {
        let format = deck.format[0].toUpperCase() + deck.format.slice(1)
        res.render('deck', { deck: deck, format: format })
    })
})

module.exports = router;
