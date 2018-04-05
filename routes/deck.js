const express = require('express');
const pmongo = require('promised-mongo')
const ObjectId = pmongo.ObjectId
const db = pmongo('MTGCards', ['cards'])
const router = express.Router();

router.get('/:deckId', (req, res) => {
    db.Decks.findOne({ "_id": ObjectId(req.params.deckId)}).then(deck => {
        res.render('deck', { deck: deck })
    })
})

module.exports = router;
