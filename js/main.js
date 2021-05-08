
// Game State
let difficulty = "Easy"
let deck = []
let drawStack = []
let mainStacks = []
let suitStacks = []

// Create deck of 52 Cards
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
        color = "black"
    }
    else {
        color = "red"
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

// Deal cards to main stacks
function dealCards() {
    for (let i = 0; i < 7; i++) {
        mainStacks[i] = []
        for (let j = 0; j <= i; j++) {
            mainStacks[i][j] = deck.pop()
            createCardCSS(mainStacks[i][j], document.querySelector(`#ms${i+1}`))
        }
        let lastCard = mainStacks[i][mainStacks.length - 1]
        flipCard(lastCard, document.getElementsByClassName(`${lastCard.suit} ${lastCard.rank}`)[0])
    }
}

// Draw cards from deck into draw stack
function drawCards() {
    if(difficulty === "Easy") {
        drawStack.push(deck.pop())
        createCardCSS(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0])
        flipCard(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0].lastChild)
        drawCardsCSS(drawStack[drawStack.length - 1])
    }
    // else {
    //     for (let i = 0; i < 3; i++) {
    //         drawStack.push(deck.pop())
    //         createCardCSS(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0])
    //         flipCard(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0].lastChild)
    //         drawCardsCSS(drawStack[drawStack.length - 1])
    //     }
    // }
}

// Flip cards
function flipCard(card, cardLocation) {
    if (card.flipped === 1) card.flipped = 0
    else card.flipped = 1
    flipCardCSS(card, cardLocation)
}

// Moving card
function moveCard(selectedCard, selectedStack, clickedCard, clickedStack) {
    if(isStack(selectedCard, selectedStack)){
        if (checkMove(selectedCard, clickedCard, clickedStack)) {
            let selectedCardIndex = selectedStack.indexOf(selectedCard)
            clickedStack += selectedStack.splice(selectedCardIndex, (selectedStack.length - selectedCardIndex))
        }
    }
    else {
        if (checkMove(selectedCard, clickedCard, clickedStack)) {
            clickedStack.push(selectedStack.pop)
        }
    }
    moveCardCSS()
    checkWin()
}

// Selected card if stack checker
function isStack(card, stack) {
    return (stack.indexOf(card) < (stack.length - 1))
}

// Check move
function checkMove(selectedCard, clickedCard, clickedStack) {
    if(selectedCard.flipped && clickedCard.flipped) {
        if(suitStacks.includes(clickedStack)) return (suitStack(selectedCard, clickedCard))
        if(mainStacks.includes(clickedStack)) return mainStackStack(selectedCard, clickedCard)
    }
}

function suitStack(selectedCard, clickedCard){
    if(selectedCard.suit === clickedCard.suit ) {
        return selectedCard.rank === clickedCard.rank - 1;
    }
}

function mainStackStack(selectedCard, clickedCard){
    if(selectedCard.color !== clickedCard.color) {
        return selectedCard.rank === clickedCard.rank - 1;
    }
}

// Check if won
function checkWin(){
    if(deck === []){
        if(drawStack === []){
            console.log(mainStacks.every(stack => stack.every(card => card.flipped)))
        }
    }
}

// New game function
function newGame() {
    shuffle();
    dealCards()
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

/* DOM for card CSS creation */

// Selectors for stacks
const $deckCSS = document.getElementsByClassName("main_deck")[0]
const $drawStackCSS = document.getElementsByClassName("draw_stack")[0]
const $suitDiamondStack = document.getElementById("ss_diamond")
const $suitClubStack = document.getElementById("ss_club")
const $suitHeartStack = document.getElementById("ss_heart")
const $suitSpadeStack = document.getElementById("ss_spade")

let selectedCardCSS = 0
let selectedCard = 0
let selectedCardStack = 0
let cardSelect = document.querySelectorAll(".card")

// Click deck
$deckCSS.addEventListener("click", function(event) {
    drawCards()
})

// Draw cards from deck
function drawCardsCSS(card) {
    $drawStackCSS.lastChild.remove()
    createCardCSS(card, $drawStackCSS)
}

// Select Cards
cardSelect.forEach(ele => ele.addEventListener('click', function(event){
    console.log(cardSelect)
    if(selectedCardCSS === event.target) { // if already selected, deselect
        event.target.classList.remove('selected')
        selectedCardCSS = 0
        selectedCard = 0
        selectedCardStack = 0
    }
    else if (selectedCardCSS === 0) { //if nothing selected
        event.target.classList.add('selected')
        selectedCardCSS = event.target
        selectedCard = selectedCardFromCSS(event.target)
    }
    else { // if something selected, and clicked something else
        if(checkMove(selectedCard, selectedCardFromCSS(event.target), selectedCardStack)) {
            moveCard(selectedCard, selectedCardStack)
        }
        selectedCardCSS.classList.remove('selected')
        selectedCardCSS = 0
        selectedCard = 0
        selectedCardStack = 0
    }
}))

// Creating cards in new location, and remove old location
function createCardCSS(card, newLocation) {
    let newCard = document.createElement("div")
    if(!card.flipped) {
        newLocation.appendChild(newCard).className = `${card.suit} ${card.rank} card unflipped`
    }
    else {
        newCard.innerHTML = `${card.suit} ${card.rank}`
        newLocation.appendChild(newCard).className = `${card.suit} ${card.rank} card`
    }
}

function flipCardCSS(card, cardLocation) {
    if(cardLocation.classList.contains("unflipped")) {
        cardLocation.classList.remove("unflipped")
        cardLocation.innerHTML = `${card.suit} ${card.rank}`
    }
    else cardLocation.classList.add("unflipped")
}

function moveCardCSS(card, oldLocation, newLocation) {
    newLocation.insertAdjacentElement("afterend", card)
}

function selectedCardFromCSS(cardCSSElement) {
    let cardCSSClasses = cardCSSElement.classList // Get the array of classes from card CSS
   let [selectedCardSuit, selectedCardRank] = cardCSSClasses // Filters out suit and rank classes from card CSS
    let stackCSSClass = cardCSSElement.parentNode.classList[0]
    if(stackCSSClass === "draw_stack"){

    }
    else if(stackCSSClass === "suit_stack"){

    }
    else { //main stacks
        for(let stack of mainStacks){
            for(let card of stack){
                if(card.suit == selectedCardSuit && card.rank == selectedCardRank) {
                    selectedCardStack = mainStacks[mainStacks.indexOf(stack)]
                    return mainStacks[mainStacks.indexOf(stack)][stack.indexOf(card)]
                }
            }
        }
    }
}
