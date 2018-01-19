const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
// const db = mongojs("mongodb://public:public@ds251217.mlab.com:51217/mtgcards", ["cards"])
const db = mongojs("MTGCards", ["Cards"])
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

router.get('/', 
    [
        check('_cmc', "CMC must be a whole number")
            .isInt().optional({ checkFalsy: true }),
        check('power', "Power must be a whole number")
            .custom((val, { req }) => Number.isInteger(+val)),
        check('toughness', "Toughness must be a whole number")
            .custom((val, { req }) => Number.isInteger(+val)),
    ],
    (req, res, next) => {
        let errs = validationResult(req).mapped()
        if (Object.keys(errs).length) {
            req.session.errors = errs
            res.redirect('filter')
            req.session.errors = null
        } else {
            cleanQuery(req.query)
            next()
        }
    }, 
    (req, res, next) => {
        db.cards.find(req.query, (err, cards) => {
            // cards = cards.filter((card, pos, arr) => {
                // arr.map(obj => {
                    // obj["name"].indexOf(card["name"]) === pos
                // })
            // })
            console.log(cards.map(card => card.name))
            res.render('result', { cards: cards })
            console.log("Found TOTAL: " + cards.length + " cards")
        })
    }
);

function cleanQuery(query) { 
    const nameString = query.name
    const cmc = +query._cmc
    const regex = new RegExp("^" + nameString + "$", "i")
    const ssregex = new RegExp(".*" + nameString + ".*", "i")
    const dbKeys = [ "name", "multiverseid", "layout", "names", "manaCost", 
        "cmc", "colors", "type", "types", "subtypes", "rarity", "text", "flavor", 
        "artist", "number", "power", "toughness", "reserved", "rulings", 
        "rulings", "printings", "originalText", "originalType", "legalities", 
        "source", "imageUrl", "set", "id", "colorIdentity" ]
    Object.keys(query).map(key => {
        if (!query[key]) { 
            delete query[key] 
        }
    })
    if (query.colors) {
        if (typeof query.colors === "object") {
            query.colors = { $in: query.colors }
        } 
    }
    if (query.types) {
        query.types = { $in: query.types.split(" ").map((x) => new RegExp(x, "i")) }
    }
    if (query.subtypes) {
        query.subtypes = { $in: query.subtypes.split(" ").map((x) => new RegExp(x, "i")) }
    }
    if (query._cmc) {
        if ("cmcQual" in query) {
            const qualifier = query.cmcQual
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
    Object.keys(query).map(key => {
        if (dbKeys.indexOf(key) === -1) {
            delete query[key]
        }
    })
    console.log(query)
}

module.exports = router;
