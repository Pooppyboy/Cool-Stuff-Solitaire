# Cool-Stuff-Solitaire
Just like the classic game Solitaire, but with a twist! Move your cards with CSS grid commands, because EVERYONE loves CSS!

# Instructions:
Choose between 2 modes to play: CSS Grid mode or Normal (Loser) mode.

CSS Grid mode:
Practise the CSS Grid by using "grid-column" & "grid-row" to move your cards.
The cards are assigned their suit and rank as classes, and you can use them as selectors.
When drawing cards, choose the deck by using the selector ".deck" and "move" to its location. Same goes for flipping faced-down cards, using ".blank"

Example: to move King of Hearts to its suit stack,

.heart 13 {
grid-column 6 / 7;
grid-row 1 / 2;
}

It's that easy!

P.S. Don't forget the semicolons.
