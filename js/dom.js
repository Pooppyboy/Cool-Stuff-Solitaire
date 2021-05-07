let selectedCard = 0
let cardSelect = document.querySelectorAll(".card")

console.log(cardSelect)
cardSelect.forEach(ele => ele.addEventListener('click', function(e){
    if(selectedCard === ele) selectedCard = 0 //deselect
    else if (selectedCard === 0) selectedCard = ele //if nothing selected
    else {
        checkMove(selectedCard, ele)
        selectedCard = 0
    }
}))

