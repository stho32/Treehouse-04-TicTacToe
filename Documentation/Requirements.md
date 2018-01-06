# Requirements

In this project, you'll build a functional, two-person Tic Tac Toe game. You'll use the provided mockups, HTML, CSS and image files to create a game that requires players to add their names, take turns adding an X or O to the game board, and announce when the game ends. You'll need to keep track of the state of the game -- whose turn it is, where the X's and O's are on the board, and whether the game is a draw or, if not, who won and lost.

You'll use your knowledge of JavaScript data structures like arrays and objects as well as DOM-manipulation using jQuery or plain JavaScript to complete this project.

And, to ensure that you're using good programming practices, you’ll use the module pattern to create your Tic-Tac-Toe game. In other words, you should wrap all of your code in a single global variable, or execute it all in a single self-invoking function. See the link in the project resources for a Treehouse workshop on the module pattern.
 - [ ] (R25) No global variables


## Instructions
 - [x] (R1) Use the supplied mockup files and HTML snippets to guide you in building a Tic Tac Toe game. You can use jQuery or plain JavaScript to complete this project. Don't use an already programmed Tic Tac Toe plugin or library.
 - [x] (R2) When the page loads, the startup screen should appear. Use the tictactoe-01-start.png mockup, and the start.txt HTML snippet to guide you.
 - [x] (R3) Add programming, so that when the player clicks the start button the start screen disappears, the board appears, and the game begins. Use the tictactoe-02-inprogress.png mockup, and the board.txt HTML snippet to guide you.
 - [x] (R4) Add the game play following these rules:
    - [x] (R4.1) Play alternates between X and O.
    - [x] (R4.2) The current player is indicated at the top of the page -- the box with the symbol O or X is highlighted for the current player. You can do this by simply adding the class .active to the proper list item in the HTML. For example, if it's player one's turn, the HTML should look like this: ```<li class="players active" id="player1">```
    - [x] (R4.3) When the current player mouses over an empty square on the board, it's symbol the X or O should appear on the square. You can do this using the x.svg or o.svg graphics (hint use JavaScript to set the background-image property for that box.)
    - [x] (R4.4) Players can only click on empty squares. When the player clicks on an empty square, attach the class box-filled-1 (for O) or box-filled-2 (for X) to the square. The CSS we're providing will automatically add the proper image to the square marking it as occupied.
    - [x] (R4.5) The game ends when one player has three of their symbols in a row either horizontally, vertically or diagonally. If all of the squares are filled and no players have three in a row, the game is a tie.


 - [x] (R5) Add programming so that when the game ends, the board disappears and the game end screen appears. Use the tictactoe-03-winner1.png and tictactoe-04-winner2.png mockups, and the win.txt HTML snippet for guidance. Depending on the game results the final screen should:
   - [x] (R5.1) Show the word "Winner" or the phrase "It's a Tie!"
   - [x] (R5.2) Add the appropriate class to the <div> for the winning screen: ```<div class="screen screen-win" id="finish">``` screen-win-one for player 1, screen-win-two for player two, or screen-win-tie if the game ends with no winner. For example, if player 1 wins, the HTML should look like this: ```<div class="screen screen-win screen-win-one" id="finish">```

 - [x] (R6) Add programming so that when a player pushes the "New Game" button, the board appears again, empty, and a new game begins.

  - [x] (R7) On the start screen, prompt the user add their name before the game starts
  - [x] (R8) Display the player’s name on the board screen during game play
  - [x] (R9) Add programming to support playing against the computer. Only one player plays; the other is controlled by your programming.
  - [x] (R10) Display the player’s name if they win the game

## Meets expectations
 - [x] (R11) Start screen appears when page loads
 - [x] (R12) Play Game button loads the Tic Tac Toe board and start the game

 - [x] (R13) Game alternates between O and X
 - [x] (R14) Active player identified on the page (The O or X is highlighted, depending on whose turn it is)
 - [x] (R15) Empty squares are highlighted with player's symbol when moused over
 - [x] (R16) Cannot click on already occupied squares
 - [x] (R17) Occupied squares are identified with an X or O
 - [x] (R18) Games ends if player has 3 symbols in a row, or the board is full
 - [x] (R19) Finish screen appears announcing winner (or tie)
 - [x] (R20) New game button starts a new game on an empty board

## Exceeds Expectations

 - [x] (R21) Player is prompted to enter their name
 - [x] (R22) Player's name appears on the board screen
 - [x] (R23) Player vs. computer. One side of the game is programmatically controlled
 - [x] (R24) Player's name appears if they win

