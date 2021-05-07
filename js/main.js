

// Game State
let difficulty = "Easy"

// Deck of 52 Cards
let deck = []
let drawStack = []
let mainStacks = []
let suits = ["diamond", "club", "heart", "spade"]
let color = ""
class card {
    constructor(suit, color, rank, flipped = 0)
    {
        this.suit = suit;
        this.color = color
        this.rank = rank;
        this.flipped = flipped
    }
}
for (let suit of suits) {
    if(suits.indexOf(suit) % 2){
        color = "Black"
    }
    else {
        color = "Red"
    }
    for (let i = 1; i <= 13; i++) {
        let newCard = new card(suit, color, i)
        deck.push(newCard)
    }
}

// Shuffle Deck
function shuffle() {
    for(let i = deck.length - 1; i >= 0; i--){
        let j = Math.floor(Math.random() * (deck.length - 1))
        let tmp = deck[i]
        deck[i] = deck[j]
        deck[j] = tmp
    }
}

// Assign cards to main stacks
function assignCards() {
    for (let i = 0; i < 7; i++) {
        mainStacks[i] = []
        for (let j = 0; j <= i; j++) {
            mainStacks[i][j] = deck.pop()
            createCard(mainStacks[i][j], document.querySelector(`#ms${i+1}`))
        }
        let lastCard = mainStacks[i][mainStacks.length - 1]
        flipCard(lastCard, document.getElementsByClassName(`${lastCard.suit} ${lastCard.rank}`)[0])

    }
}

// Draw cards from deck into draw stack
function drawCards() {
    if(difficulty === "Easy"){
        drawStack.unshift(deck.pop())
        flipCard(drawStack[0])
    }
    else {
        for (let i = 0; i < 3; i++) {
            drawStack.unshift(deck.pop())
            flipCard(drawStack[0])
        }
    }
}

// Flip cards
function flipCard(card, location) {
    card.flipped = 1
    location.classList.remove("unflipped")
    location.innerHTML = `${card.suit} ${card.rank}`
}

// Main area stack checker

// Check if won
function checkWin(){
    if(deck.every(function(e){
        return e.flipped
    })) {
        console.log("Win")
    }
}

// Creating cards
function createCard(card, location) {
    let newCard = document.createElement("div")
    if(!card.flipped) {
        location.appendChild(newCard).className = `unflipped ${card.suit} ${card.rank} card`
    }
    else {
        newCard.innerHTML = `${card.suit+card.rank}`
        location.appendChild(newCard).className = `${card.suit} ${card.rank} card`
    }
}

// Check move
function checkMove(selectedCard, clickedCard) {
    suitStack(selectedCard, clickedCard)
    mainStackStack(selectedCard, clickedCard)
}

function suitStack(selectedCard, clickedCard){

}

function mainStackStack(selectedCard, clickedCard){

}

// New game function
function newGame() {
    shuffle();
    assignCards()
}

newGame()
// shuffle()
// console.log(deck)
// assignCards()
// drawCards()
// console.log(deck)
// console.log(mainStacks)
// console.log(drawStack)
// checkWin()
