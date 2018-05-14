const pmongo = require('promised-mongo')
const db = pmongo("MTGCards", ["Decks"])
const cheerio = require("cheerio")
const fetch = require("node-fetch")
const root = "http://www.mtggoldfish.com"
const url = "http://www.mtggoldfish.com/metagame/modern/full#paper"
const formatList = [
    "Standard",
    "Modern",
    "Pauper",
    "Legacy",
    "Vintaqe",
    "Commander_1v1",
    "Commander"
]

function formatToUrl(format) {
    return "http://www.mtggoldfish.com/metagame/" + format + "/full#paper"
}

function Card(quantity, name) {
    this.name = name
    this.quantity = quantity
}

function Deck(name, maindeck, sideboard, format, meta_perc) {
    this.name = name
    this.sideboard = sideboard
    this.maindeck = maindeck
    this.format = format
    this.metaPercentage = meta_perc
}

function createDecksList(format) {
    fetch(formatToUrl(format))
        .then(response => response.text())
        .then(body => {
            let decklist = []
            body.split("\n").forEach(line => {
                if (line.includes("archetype") && line.includes("#paper")) {
                    let re = /"(.*)"/
                    decklist.push(line.match(re)[1])
                }
            })
            decksList = []

            decklist
            .slice(0, (100 < decklist.length ? 100 : decklist.length))
            .forEach(deck => {
                fetch(root + deck)
                    .then(response => response.text())
                    .then(body => {
                        let $ = cheerio.load(body)
                        let name = $(".deck-view-title").text()
                        let meta_percentage = body.match(/\((.*)% of meta\)/)
                        meta_percentage = +meta_percentage[1]

                        let maindeck = [];
                        let sideboard = [];
                        let arr_ptr = maindeck;

                        let deck = $("[id=deck_input_deck]")
                            .attr("value")
                            .split("\n")
                            .map(d => d.split(/\s(.*)/).slice(0, 2))
                            
                        deck.forEach(card => {
                            if (card[0] === "sideboard") {
                                arr_ptr = sideboard
                            } else {
                                arr_ptr.push(new Card(+card[0], card[1]))
                            }
                        })
                        sideboard = sideboard.slice(0, sideboard.length - 1)
                        currDeck = new Deck(name.split("\n")[1], 
                                            maindeck, 
                                            sideboard,
                                            format,
                                            meta_percentage)
                        if (format.search(/.*commander.*/i) != -1) {
                            delete currDeck.sideboard
                            currDeck.format = "commander"
                        }
                        decksList.push(currDeck)
                        return decksList
                    })
            })
                .then(list => {
                    list.forEach(deck => {
                        db.Decks.insert(deck)
                    })
                })
        });
}

// createDecksList("standard")
// createDecksList("modern")
// createDecksList("pauper")
// createDecksList("legacy")
// createDecksList("vintage")
// createDecksList("commander_1v1")
// createDecksList("commander")
