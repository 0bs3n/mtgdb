### MTGDB
A Database of Magic the Gathering Cards, searchable by a variety of attributes including:
* Name
* Color
* Rarity
* Type/Subtype
* Power/Toughness
* Converted Mana Cost

![filter page](docs/main_search.png)

The card information is pulled in using the [mtg api](https://docs.magicthegathering.io/) and stored in a MongoDB database as a collection of card objects.
After the desired card is chosen, information for the card including all edition artwork, flavor text, and rules text is sent to the view from the server, 
as well as a list of all decks in the meta currently playing the card. Each listed deck is a link to a full card list for the deck.
