/* Stack arrays behaviour

Stacks are treated as "1st card on top, last card in array". (Imagine the suit stacks in order)

Deck -> To remove top card, pop (1st card on top, last card in array)
To place in draw stack, push (New cards will be 1st card on top, so goes to last card in array)

Suit stacks -> Cards will be pushed in and popped out

Main stacks -> Cards on top are also bottom of stack, so 1st cards in array.
Pop to remove, push to insert

*/

// Define Game area
let gameArea = {
    deck: [],
    drawStack: [],
    mainStack: {

    },
    suitStack: {
        diamond: [],
        club: [],
        heart: [],
        spade: []
    }
}

// Create class constructor of card
class card {
    constructor(suit, rankName, rankValue) {
        this.suit = suit
        this.rankName = rankName
        this.rankValue = rankValue
        this.color = (suit === 'diamond' || suit === 'hearts') ? 'red': 'black'
        this.flipped = false
        this.id = `${this.suit}-${this.rankName}`
    }
}

// Creates deck based on suits & ranks
function deckCreate(suits, ranks) {
    suits.forEach(suit => {
        ranks.forEach((rank, rankValue) => {
            let newCard = new card(suit, rank, (rankValue + 1))
            gameArea.deck.push(newCard)
        })
    })
}

// Reallocates indexs of cards in deck
function shuffleDeck(deck) {
    deck.forEach((card, index) => {
        let randomIndex = Math.floor(Math.random() * (deck.length - 1))
        deck[index] = deck[randomIndex]
        deck[randomIndex] = card
    })
    document.getElementById("cardShuffle").play() // Plays shuffle audio
}

function drawFromDeck(drawSize) {
    for(let times in drawSize) {
        deck.
    }
}
