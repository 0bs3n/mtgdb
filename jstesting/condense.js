function groupByName(items) {
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
}


function cardList(collection, query) {
    return new Promise((resolve, reject) => {
        collection.find(query).toArray().then(result => {
            if (result) 
                resolve(result); 
            else 
                reject(new Error("no can do bud"));
        });
    });
}


function finalList(full, condensed) {
    let imgUrlList = [];
    for (let i of condensed) {
        full.map(obj => {
            if (obj.id === i.idList[0]) {
                imgUrlList.push({ 
                    id: obj.id, 
                    imageUrl: obj.imageUrl,
                    name: obj.name
                });
            }
        });
    }
    return imgUrlList;
}

function parseForImages(collection, query) {
    let fullCardList = cardList(collection, query);
    let newCards = fullCardList.then(cards => {
        return new Promise((resolve, reject) => {
            resolve(groupByName(cards));
            reject(new Error("OH NO"));
        });
    });
    return Promise.all([
        fullCardList,
        newCards
    ]).then(sets => {
        let full = sets[0];
        let condensed = sets[1];
        return finalList(full, condensed);
    });
}
module.exports = parseForImages;
