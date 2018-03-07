const pmongo = require("mongojs");
const db = pmongo("MTGCards", ["cards"]);

let cardsCondense = items => {
    let uniqueCards = [];
    for ( let i = 0; i < items.length; ++i) {
        if (!uniqueCards.filter(x => x.name === items[i].name).length) {
            uniqueCards.push({ name: items[i].name, idList: [ items[i].id ] });
        } else {
            uniqueCards.filter(x => x.name === items[i].name)[0]
                .idList.push(items[i].id);
        }
    }
    return uniqueCards;
};

let makeCardList = async (query, collection) => {
    console.log("calling");
    let results = await collection.find(query).toArray();
    return cardsCondense(results);
};

let cards = makeCardList({ name: { "$regex": /.*blood.*/i }}, db.cards)
    .then(list => list);

// db.cards.find().then((err, cards) => console.log(cards));

// cards.then((cards) => console.log(cards));

cards.then((cards) => {
    db.cards.find({}, ((err, result) => { 
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    }));
});
/*
cards.then((cards) => cards.map(card => {
    db.cards.find({ id: card.idList[0]}, (err, result) => {
        console.log(result);
    });
}));
*/
