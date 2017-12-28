/*
    Js Source Code for the TicTacToe Project

    github/stho32
*/

const $startScreen = $("#start");
const $startScreenButton = $("#screen-start-button");
const $board = $("#board");

/* (R2) at startup the board is hidden and the start screen is displayed */
function StartupScreenInteraction() {
    $board.hide()
    $startScreen.show();

    $startScreenButton.on("click", () => {
        $startScreen.hide();
        $board.show();
    });
}

StartupScreenInteraction();

/* The Player class encapsulates the interaction 
   between player state and UI.
*/
function Player(id, sign) {
    // display of currently active player
    let $headerSign = $("#player" + id);
    // is this player instance active at the moment?
    let isActive = false;
    // this css class is used for the hover effect above empty boxes
    let boxEmptyCssClass = "box--empty-" + sign;
    // this css class displays the symbol of the player
    let playerSignCssClass = "box-filled-" + id;

    /* These functions and properties can 
       be used from outside. */
    let publicApi = {
        Id: id,
        Sign: sign,
        PlayerSignCssClass : playerSignCssClass
    };

    /* Activate and deactivate player 
       
       - show active state in the header of the game screen
       - toggle the boxEmptyCssClass on all empty boxes, so that 
         it looks like we want to place the players sign everywhere.
    */
    publicApi.setActive = (active) => {
        if (active !== isActive) {
            isActive = active;

            $headerSign.toggleClass("active");

            $board.find(".box:not(.box-filled-1):not(.box-filled-2)").toggleClass(boxEmptyCssClass, isActive);
        }
    };

    return publicApi;
}

/* The Gameboard: Two players & game state
   as well as UI interaction.
*/
function Gameboard() {

    let playerO = Player(1, "O");
    let playerX = Player(2, "X");
    let activePlayer = playerO;
    
    /* Activate the "activePlayer", deactivate the other one */
    function performPlayerActivation() {
        playerO.setActive(activePlayer.Sign === "O");
        playerX.setActive(activePlayer.Sign === "X");
    }

    /* Place the sign of the currently active player 
       at the given position. 
    */
    function placeSignAtPosition(row, column) {
        let boxes = $board.find(".box");
        let position = 3*(row-1) + column; 
        $(boxes[position]).addClass(activePlayer.PlayerSignCssClass);
    }

    return {
        playerO : playerO,
        playerX : playerX,

        /* Select the next player */
        nextPlayer : () => {
            if (activePlayer.Sign === "X") {
                activePlayer = playerO;
            } else {
                activePlayer = playerX;
            }

            performPlayerActivation();
        },

        /* Place the sign of the currently active player
           at position (row, column). */
        placeSignAtPosition : placeSignAtPosition
    }

}

let gameboard = Gameboard();
