/* Game State */
let difficulty = "Easy"
//Decks
/* Arrangement of deck/stacks are from bottom(1st card in array) to top(last card in array) i.e. pop deck to draw top card, pop main stack to move last card */
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
            createCardHTML(mainStacks[i][1][j], mainStacks[i]) // Create HTML of card with card object, array it's in, and index
        }
        let lastCard = mainStacks[i][1][mainStacks.length - 1] // Assign last card of stack
        // flipCard(lastCard, document.getElementsByClassName(`${lastCard.suit} ${lastCard.rank}`)[0])
        flipCard(lastCard, mainStacks[i]) // Flip the last card
    }
}

// Draw cards from deck into draw stack
function drawCards() {
    if (deck.length === 0) {
        if (drawStack[0][1] !== []) {
            deletePreviousCardHTML(drawStack[0][1][drawStack.length - 1])
            deck = drawStack[0][1].reverse()
            for (let card of deck) card.flipped = 0
            drawStack[0][1] = []
        }
    } else if (difficulty === "Easy") { // Easy difficulty - draws one card at a time
        drawStack[0][1].push(deck.pop()) // Take top card of deck (last card in array) and push to draw stack
        drawCardHTML(drawStack[0][1][drawStack[0][1].length - 1], drawStack[0])
        flipCard(drawStack[0][1][drawStack[0][1].length - 1], drawStack[0])
    }
    /* For hard difficulty */
    document.querySelectorAll(".card").forEach(ele => ele.addEventListener('click', selectCard))
}

// Flip cards
function flipCard(card) {
    if (card.flipped === 1) card.flipped = 0
    else card.flipped = 1
    flipCardHTML(card)
}

// Moving card
function moveCard(selectedCard, selectedCardStack, clickedCard, clickedCardStack) {
    console.log(selectedCardStack)
    // If card is the beginning of a stack (from main stack or pile (hard difficulty))
    if (isStack(selectedCardStack, selectedCardStack[1].indexOf(selectedCard))) {
        for (let stack of mainStacks) {
            if (stack === selectedCardStack) { // If card is from main stack
                for (let stack2 of mainStacks) {
                    if (stack2 === clickedCardStack) { // If moving to another stack in main stack
                        if (moveCheck(selectedCard, clickedCard, clickedCardStack)) { // Check if move is valid
                            for (let i = selectedCardStack[1].indexOf(selectedCard); i < selectedCardStack[1].length;) {
                                deletePreviousCardHTML(selectedCardStack[1][i])
                                createCardHTML(selectedCardStack[1][i], clickedCardStack)
                                clickedCardStack[1].push(selectedCardStack[1].splice(i, 1))

                            }
                        }
                    }
                }
            }
        }
    }
    // If card is a single card from either main, draw or suit stacks
    else {
        if (moveCheck(selectedCard, clickedCard, clickedCardStack)) { // Check if move is valid
            deletePreviousCardHTML(selectedCard)
            clickedCardStack[1].push(selectedCardStack[1].pop()) // Remove pop card from selected and push to clicked
            createCardHTML(selectedCard, clickedCardStack) // Generate HTML
            if (selectedCardStack[0] === "draw") {
                createCardHTML(drawStack[0][1][drawStack[0][1].length - 1], drawStack[0])
            }
        }
    }
    document.querySelectorAll(".card").forEach(ele => ele.addEventListener('click', selectCard))
    document.querySelectorAll(".suit_stack").forEach(ele => ele.addEventListener('click', selectEmptySuitStack))
    document.querySelectorAll(".main_stack").forEach(ele => ele.addEventListener('click', selectEmptyMainStack))
    checkWin()
}

// Selected card if stack checker
function isStack(stack, cardIndex) {
    return (cardIndex < (stack[1].length - 1))
}

// Check move
function moveCheck(selectedCard, clickedCard, clickedCardStack) {
    if (clickedCard === 0) return true
    if (selectedCard.flipped && clickedCard.flipped) { // if selected and clicked cards are both flipped (allowed to move / moved to)
        // Iterate thru the suit stacks, if array is found within suit stacks, move check for suit rules
        for (let suit of suitStacks) {
            if (suit === clickedCardStack) return moveCheckSuitStacks(selectedCard, clickedCard)
        }
        for (let stack of mainStacks) {
            if (stack === clickedCardStack) {
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
    if (clickedCard)
        if (selectedCard.color !== clickedCard.color) {
            return selectedCard.rank === clickedCard.rank - 1;
        }
}

// Check if won
function checkWin() {
    // If each array in each suit has a length of 13
    if (suitStacks.every(suit => suit[1].length === 13)) console.log("Win")
    // If both deck and draw stack are empty, & all cards in main stacks are flipped
    if (deck === [] && drawStack === []) {
        if (mainStacks.every(stack => stack[1].every(card => card.flipped))) console.log("Auto Win")
    }
}

// New game function
function newGame() {
    shuffle();
    dealCards()
    document.querySelectorAll(".card").forEach(ele => ele.addEventListener('click', selectCard))
    document.querySelectorAll(".suit_stack").forEach(ele => ele.addEventListener('click', selectEmptySuitStack))
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
let $mainStack = document.querySelectorAll(".main_stack")

/* Listeners for clicks */
// Click deck
$deckHTML.addEventListener("click", function (event) {
    drawCards()
})

// Select Cards from HTML and translating to game script
function selectCard(event) {
    if (selectedCardHTML === event.target) { // if already selected, deselect
        event.target.classList.remove('selected')
        selectedCardHTML = 0
        selectedCard = 0
        selectedCardStack = 0
    } else if (selectedCardHTML === 0) { //if nothing selected
        if (!selectedCardFromHTML(event.target).flipped) { // if card is not flipped
            if (selectedCardStackFromHTML(event.target)[1].indexOf(selectedCardFromHTML(event.target)) === selectedCardStackFromHTML(event.target)[1].length - 1) { // if last card of stack
                flipCard(selectedCardFromHTML(event.target), selectedCardStackFromHTML(event.target))
            }
        } else { // if flipped
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
    event.stopPropagation()
}

//Empty main stack listener
function selectEmptyMainStack(event) {
    if (selectedCard.rank === 13) {
        if (event.target.childElementCount === 0) {
            let newCard = document.createElement("div")
            event.target.appendChild(newCard).className = 'placeholder'
            moveCard(selectedCard, selectedCardStack, selectedCardFromHTML(event.target.firstChild), selectedCardStackFromHTML(event.target.firstChild))
            document.querySelector('.placeholder').remove()
            selectedCardHTML.classList.remove('selected')
            selectedCardHTML = 0
            selectedCard = 0
            selectedCardStack = 0
        }
    }
}

//Empty suit stacks listeners
function selectEmptySuitStack(event) {
    if (selectedCard !== 0) {
        if (event.target.classList[1] === selectedCard.suit && selectedCard.rank === 1) {
            let newCard = document.createElement("div")
            event.target.appendChild(newCard).className = 'placeholder'
            moveCard(selectedCard, selectedCardStack, selectedCardFromHTML(event.target.firstChild), selectedCardStackFromHTML(event.target.firstChild))
            document.querySelector('.placeholder').remove()
            selectedCardHTML.classList.remove('selected')
            selectedCardHTML = 0
            selectedCard = 0
            selectedCardStack = 0
        }
    }
}

function selectedCardFromHTML(cardHTML) {
    let cardHTMLClasses = cardHTML.classList // Get the array of classes from card HTML
    if (cardHTMLClasses[0] === "placeholder") return 0
    let [selectedCardSuit, selectedCardRank] = cardHTMLClasses // Filters out suit and rank classes from card HTML
    let stackHTMLClass
    if (cardHTMLClasses[0] === "main_stack") {
        stackHTMLClass = cardHTML.classList[0]
    } else stackHTMLClass = cardHTML.parentNode.classList[0]
    if (stackHTMLClass === "draw_stack") { // if card from draw stacks
        for (let card of drawStack[0][1]) {
            if (card.suit == selectedCardSuit && card.rank == selectedCardRank) {
                return drawStack[0][1][drawStack[0][1].indexOf(card)]
            }
        }
    } else if (stackHTMLClass === "suit_stack") { // if card from suit stacks
        for (let stack of suitStacks) {
            for (let card of stack[1]) {
                if (card.suit == selectedCardSuit && card.rank == selectedCardRank) {
                    return suitStacks[suitStacks.indexOf(stack)][1][stack[1].indexOf(card)]
                }
            }
        }
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
        return drawStack[0]
    } else if (cardHTML.parentNode.classList[0] === "suit_stack") {
        for (let stack of suitStacks) {
            if (stack[0] === stackHTMLClass) {
                return stack
            }
        }
    } else {
        for (let stack of mainStacks) {
            if (stack[0] === stackHTMLClass) {
                return stack
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
        if (stack === cardStack) {
            return document.getElementsByClassName(`${stack[0]}`)[0]
        }
    } // Check if suit stack
    for (let stack in suitStacks) {
        if (stack === cardStack) {
            return document.getElementsByClassName(`${stack[0]}`)[0]
        }
    }
    // Else if draw stack
    return document.getElementsByClassName("draw_stack")[0]
}

// Draw cards from deck
function drawCardHTML(card, cardStack) {
    if ($drawStackHTML.lastChild) $drawStackHTML.lastChild.remove()
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

