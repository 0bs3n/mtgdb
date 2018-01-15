const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs("mongodb://public:public@ds251217.mlab.com:51217/mtgcards", ["cards"])

router.get('/', 
    (req, res, next) => {
        cleanQuery(req.query) 
        next()
    }, 
    (req, res, next) => {
        db.cards.find(req.query, (err, cards) => {
            res.render('result', { cards: cards })
        })
    }
);

function cleanQuery(query) { 
    let errors = {}
    const nameString = query.name
    const regex = new RegExp("^" + nameString + "$", "i")
    const ssregex = new RegExp(".*" + nameString + ".*", "i")
    const dbKeys = [ "name", "multiverseid", "layout", "names", "manaCost", 
        "cmc", "colors", "type", "subtypes", "rarity", "text", "flavor", 
        "artist", "number", "power", "toughness", "reserved", "rulings", 
        "rulings", "printings", "originalText", "originalType", "legalities", 
        "source", "imageUrl", "set", "id", "colorIdentity" ]
    Object.keys(query).map(key => {
        if (!query[key]) { 
            delete query[key] 
        }
        if (query._cmc) {
            const cmc = +query._cmc
            if (isNaN(cmc)) {
                console.log("CMC must be a number!")
                errors.cmc = "CMC must be a number!"
            }
            if ("searchCMCBy" in query) {
                const qualifier = query.searchCMCBy
                query.cmc = { [qualifier]: cmc }
            } else {
                query.cmc = cmc
            }
        }
        if ("name" in query) {
            if (query.fuzzy) {
                query.name = { $regex: ssregex }
            } else {
                query.name = { $regex: regex }
            }
        }
    })
    Object.keys(query).map(key => {
        if (dbKeys.indexOf(key) === -1) {
            delete query[key]
        }
    })
    return errors
}

module.exports = router;
