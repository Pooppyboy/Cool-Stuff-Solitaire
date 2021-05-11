/* Game State */
let difficulty = "Easy"
//Decks
/* Arrangement of deck/stacks are from bottom(1st card in array) to top(last card in array) i.e. pop deck to draw top card, pop main stack to move last card */
let deck = []
let drawStack = []
let mainStacks = []
let suitStacks = [
    ["diamond", []],
    ["club", []],
    ["heart", []],
    ["spade", []]
]

/* Game script */
// Create deck of 52 Cards
const suits = ["diamond", "club", "heart", "spade"]
let color = ""

// Create class constructor of card
class card {
    constructor(suit, color, rank, flipped = 0) {
        this.suit = suit;
        this.rank = rank;
        this.color = color
        this.flipped = flipped
    }
}

// Assigns color value to cards based on suit index
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

// Shuffle Deck
function shuffle() {
    for (let i = deck.length - 1; i >= 0; i--) { // For each card in deck
        let j = Math.floor(Math.random() * (deck.length - 1)) // Assign a random index from 0 to 51
        let temp = deck[i] // Temp location to store the ith card
        deck[i] = deck[j] // Replace ith card with jth card
        deck[j] = temp // Put ith card in jth position
    }
}

// Deal cards to main stacks
function dealCards() {
    for (let i = 0; i < 7; i++) { // Iterates 7 main stacks
        mainStacks[i] = [`m${i + 1}`, []] // Create array for individual stacks
        for (let j = 0; j < i + 1; j++) { // Iterates i+1 times  within stacks
            mainStacks[i][1][j] = deck.pop() // Insert cards into each main stack
            // createCardHTML(mainStacks[i][j], document.querySelector(`#ms${i+1}`))
            createCardHTML(mainStacks[i][1][j], mainStacks[i][1]) // Create HTML of card with card object, array it's in, and index
        }
        let lastCard = mainStacks[i][1][mainStacks.length - 1] // Assign last card of stack
        // flipCard(lastCard, document.getElementsByClassName(`${lastCard.suit} ${lastCard.rank}`)[0])
        flipCard(lastCard, mainStacks[i][1]) // Flip the last card
    }
}

// Draw cards from deck into draw stack
function drawCards() {
    if(deck.length === 0) {
        if(drawStack !== []){
            deletePreviousCardHTML(drawStack[drawStack.length - 1])
            deck = drawStack.reverse()
            for(let card of deck) card.flipped = 0
            drawStack = []
        }
    } else if (difficulty === "Easy") { // Easy difficulty - draws one card at a time
        drawStack.push(deck.pop()) // Take top card of deck (last card in array) and push to draw stack
        drawCardHTML(drawStack[drawStack.length - 1], drawStack)
        flipCard(drawStack[drawStack.length - 1], drawStack)
    }
    // // Hard difficulty - draw 3 cards at once
    // else {
    //     for (let i = 0; i < 3; i++) {
    //         drawStack.push(deck.pop())
    //         createCardHTML(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0])
    //         flipCard(drawStack[drawStack.length - 1], document.getElementsByClassName("draw_stack")[0].lastChild)
    //         drawCardsHTML(drawStack[drawStack.length - 1])
    //     }
    // }
}

// Flip cards
function flipCard(card, cardStack) {
    if (card.flipped === 1) card.flipped = 0
    else card.flipped = 1
    flipCardHTML(card, cardStack)
}

// Moving card
function moveCard(selectedCard, selectedCardStack, clickedCard, clickedCardStack) {
    // If card is the beginning of a stack (from main stack or pile (hard difficulty))
    if (isStack(selectedCardStack, selectedCardStack.indexOf(selectedCard))) {
        for(let stack of mainStacks) {
            if (stack.includes(selectedCardStack)) { // If card is from main stack
                for(let stack2 of mainStacks) {
                    if (stack2.includes(clickedCardStack)) { // If moving to another stack in main stack
                        if (moveCheck(selectedCard, clickedCard, clickedCardStack)) { // Check if move is valid
                            for (let i = selectedCardStack.indexOf(selectedCard); i < selectedCardStack.length;) {
                                deletePreviousCardHTML(selectedCardStack[i])
                                createCardHTML(selectedCardStack[i], clickedCardStack)
                                clickedCardStack.push(selectedCardStack.splice(i, 1))

                            }
                        }
                    }
                }
            }
        }
    }
    // If card is a single card from either main, draw or suit stacks
    else {
        console.log('not stack')
        if (moveCheck(selectedCard, clickedCard, clickedCardStack)) { // Check if move is valid
            deletePreviousCardHTML(selectedCard)
            clickedCardStack.push(selectedCardStack.pop()) // Remove pop card from selected and push to clicked
            createCardHTML(selectedCard, clickedCardStack) // Generate HTML
        }
    }
    checkWin()
}

// Selected card if stack checker
function isStack(stack, cardIndex) {
    return (cardIndex < (stack.length - 1))
}

// Check move
function moveCheck(selectedCard, clickedCard, clickedCardStack) {
    if (selectedCard.flipped && clickedCard.flipped) { // if selected and clicked cards are both flipped (allowed to move / moved to)
        // Iterate thru the suit stacks, if array is found within suit stacks, move check for suit rules
        for (let suit of suitStacks) {
            if (suit.includes(clickedCardStack)) return moveCheckSuitStacks(selectedCard, clickedCard)
        }
        for (let stack of mainStacks) {
            if (stack.includes(clickedCardStack)) {
                return moveCheckMainStacks(selectedCard, clickedCard)
            }
        }
    }
    return false
}

// Check if move to suit stacks is valid
function moveCheckSuitStacks(selectedCard, clickedCard) {
    if (selectedCard.suit === clickedCard.suit) {
        return selectedCard.rank === clickedCard.rank - 1;
    }
}

// Check if move to main stacks is valid
function moveCheckMainStacks(selectedCard, clickedCard) {
    if(clickedCard)
    if (selectedCard.color !== clickedCard.color) {
        return selectedCard.rank === clickedCard.rank - 1;
    }
}

// Flip card if last card of stack & not flipped, when selected
function lastCardReveal(card, cardStack, cardIndex) {
    if (!card.flipped && cardIndex === cardStack[cardStack.length - 1]) {
        card.flipped = 1
        createCardHTML(card, cardStack)
    }
}

// Check if won
function checkWin() {
    // If each array in each suit has a length of 13
    if (suitStacks.every(suit => suit.every(stack => stack[1].length === 13))) console.log("Win")
    // If both deck and draw stack are empty, & all cards in main stacks are flipped
    if (deck === [] && drawStack === []) {
        if (mainStacks.every(stack => stack.every(card => card.flipped))) console.log("Auto Win")
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

/* DOM for card HTML creation */

// Storage variables for selection (card, stack array, & position in stack)
let selectedCard = 0
let selectedCardStack = 0
let selectedCardHTML = 0

// Selectors for stacks
let $cardSelect = document.querySelectorAll(".card")
const $deckHTML = document.getElementsByClassName("main_deck")[0]
const $drawStackHTML = document.getElementsByClassName("draw_stack")[0]
const $suitDiamondStack = document.getElementsByClassName("suit_stack diamond")[0]
const $suitClubStack = document.getElementsByClassName("suit_stack club")[0]
const $suitHeartStack = document.getElementsByClassName("suit_stack heart")[0]
const $suitSpadeStack = document.getElementsByClassName("suit_stack spade")[0]
const $mainStack = document.getElementsByClassName("main_stack")

/* Listeners for clicks */
// Click deck
$deckHTML.addEventListener("click", function (event) {
    drawCards()
})

// Select Cards from HTML and translating to game script
$cardSelect.forEach(ele => ele.addEventListener('click', function (event) {
    console.log($cardSelect)
    if (selectedCardHTML === event.target) { // if already selected, deselect
        event.target.classList.remove('selected')
        selectedCardHTML = 0
        selectedCard = 0
        selectedCardStack = 0
    } else if (selectedCardHTML === 0) { //if nothing selected
        if (!selectedCardFromHTML(event.target).flipped) { // if card is not flipped
            if (selectedCardStackFromHTML(event.target).indexOf(selectedCardFromHTML(event.target)) === selectedCardStackFromHTML(event.target).length - 1) { // if last card of stack
                flipCard(selectedCardFromHTML(event.target), selectedCardStackFromHTML(event.target))
            }
        }
        else { // if flipped
            event.target.classList.add('selected')
            selectedCardHTML = event.target
            selectedCard = selectedCardFromHTML(event.target)
            selectedCardStack = selectedCardStackFromHTML(event.target)
        }
    } else { // if something selected, and clicked something else
        moveCard(selectedCard, selectedCardStack, selectedCardFromHTML(event.target), selectedCardStackFromHTML(event.target))
        selectedCardHTML.classList.remove('selected')
        selectedCardHTML = 0
        selectedCard = 0
        selectedCardStack = 0
    }
}))

function selectedCardFromHTML(cardHTML) {
    let cardHTMLClasses = cardHTML.classList // Get the array of classes from card HTML
    let [selectedCardSuit, selectedCardRank] = cardHTMLClasses // Filters out suit and rank classes from card HTML
    let stackHTMLClass = cardHTML.parentNode.classList[0]
    if (stackHTMLClass === "draw_stack") { // if card from draw stacks

    } else if (stackHTMLClass === "suit_stack") { // if card from suit stacks

    } else { // if card from main stacks
        for (let stack of mainStacks) {
            for (let card of stack[1]) {
                if (card.suit == selectedCardSuit && card.rank == selectedCardRank) {
                    return mainStacks[mainStacks.indexOf(stack)][1][stack[1].indexOf(card)]
                }
            }
        }
    }
}

function selectedCardStackFromHTML(cardHTML) {
    let stackHTMLClass = cardHTML.parentNode.classList[1]
    if (cardHTML.parentNode.classList[0] === "draw_stack") {

    } else if (cardHTML.parentNode.classList[0] === "suit_stack") {
        for (let stack of suitStacks) {
            if (stack[0] === stackHTMLClass) {
                return stack[1]
            }
        }
    } else {
        for (let stack of mainStacks) {
            if (stack[0] === stackHTMLClass) {
                return stack[1]
            }
        }
    }
}

// Finds card html location from value in array
function cardDivFromCard(card) {
    return document.getElementsByClassName(`${card.suit} ${card.rank}`)[0]
}

// Finds stack html location from array
function stackDivFromStack(cardStack) {
    // Check if main stack
    for (let stack of mainStacks) {
        if (stack.includes(cardStack)) {
            return document.getElementsByClassName(`${stack[0]}`)[0]
        }
    } // Check if suit stack
    for (let stack in suitStacks) {
        if (stack.includes(cardStack)) {
            return document.getElementsByClassName(`${stack[0]}`)[0]
        }
    }
    // Else if draw stack
    return document.getElementsByClassName("draw_stack")[0]
}

// Draw cards from deck
function drawCardHTML(card, cardStack) {
    if($drawStackHTML.lastChild) $drawStackHTML.lastChild.remove()
    createCardHTML(card, stackDivFromStack(cardStack))
}

// Creating cards in html location from card value and array
function createCardHTML(card, cardStack) {
    let newCard = document.createElement("div")
    if (!card.flipped) {
        stackDivFromStack(cardStack).appendChild(newCard).className = `${card.suit} ${card.rank} ${card.color} card notFlipped`
    } else {
        newCard.innerHTML = `.${card.suit} ${card.rank}`
        stackDivFromStack(cardStack).appendChild(newCard).className = `${card.suit} ${card.rank} ${card.color} card`
    }
}

function flipCardHTML(card) {
    if (cardDivFromCard(card).classList.contains("notFlipped")) {
        cardDivFromCard(card).classList.remove("notFlipped")
        cardDivFromCard(card).innerHTML = `.${card.suit} ${card.rank}`
    } else cardDivFromCard(card).classList.add("notFlipped")
}

function deletePreviousCardHTML(card) {
    cardDivFromCard(card).remove()
}

