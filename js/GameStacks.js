let deck = []
let drawStack = [
    ["draw", []]
]
let mainStacks = []
let suitStacks = [
    ["diamond", []],
    ["club", []],
    ["heart", []],
    ["spade", []]
]
let ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"]

// Create deck of 52 Cards
const suits = ["diamond", "club", "heart", "spade"]
let color = ""

// Create class constructor of card
export class card {
    constructor(suit, color, rank, flipped = false, htmlLocation, ) {
        this.suit = suit
        this.rank = rank
        this.color = color
        this.flipped = flipped

    }
}

function deckCreate() {
    for (let suit of suits) {
        if (suits.indexOf(suit) % 2) {
            color = "black"
        } else {
            color = "red"
        }
        // Pushing cards into deck
        for (let i = 1; i <= 13; i++) {
            let newCard = new card(suit, color, i)
            deck.push(newCard)
        }
    }
}
