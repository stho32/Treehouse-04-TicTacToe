/*
    Js Source Code for the TicTacToe Project

    github/stho32
*/


// "use strict"

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
function Player(id, sign, playerType) {
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
        PlayerSignCssClass : playerSignCssClass,
        PlayerType : playerType
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

            // remove all hover effects for this player
            $board.find("." + boxEmptyCssClass).removeClass(boxEmptyCssClass);
            // activate hover effect if needed
            if ( isActive ) {
               $board.find(".box:not(.box-filled-1):not(.box-filled-2)").addClass(boxEmptyCssClass);
            }
        }
    };

    return publicApi;
}

/* This is how a human player makes a move. */
function HumanPlayerInteraction(player, gameboard) {
    let emptyBoxes = gameboard.GetEmptyBoxes();

    // 1. activate empty box event handlers
    // 2. wait for user to make a click
    emptyBoxes.on("click", (event) => {
        let $box = $(event.target);

        let row = $box.data("row");
        let column = $box.data("column");

        // 3. place sign
        gameboard.PlaceSignAtPosition(row, column);

        // 4. give control back to the gameboard ("next player")
        emptyBoxes.off("click");
        gameboard.NextPlayer();
    })
}

/* This is how a computer player makes a move. */
function ComputerPlayerInteraction(player, gameboard) {
    // 1. activate some animation that tells the user to wait
    // 2. calculate and think
    // 3. place sign
    // 4. give control back to the gameboard ("next player")
}

/* "make a move" */
function ExecutePlayerInteraction(player, gameboard) {

    if ( player.PlayerType === "human" )    return HumanPlayerInteraction(player, gameboard);
    if ( player.PlayerType === "computer" ) return ComputerPlayerInteraction(player, gameboard);

    alert("I do not know what player type " + player.PlayerType + " is. I do not know how to let it interact properly. Please add amazing source code to me to solve the problem.");
}


/* The Gameboard: Two players & game state
   as well as UI interaction.
*/
function Gameboard() {
    /* I declare everything that can be called and used from outside
       as "publicApi". This way I can not only return it to the main 
       thread, I can pass it to dependencies, too. 
       I need that ability to separate PlayerInteractions with the board
       into there on "class-resembling"-functions.
    */    
    let publicApi = {};
    publicApi.PlayerO = Player(1, "O", "human");
    publicApi.PlayerX = Player(2, "X", "human");
    publicApi.ActivePlayer = publicApi.PlayerO;
    /* --- */
    
    /* Activate the "activePlayer", deactivate the other one */
    function performPlayerActivation() {
        publicApi.PlayerO.setActive(publicApi.ActivePlayer.Sign === "O");
        publicApi.PlayerX.setActive(publicApi.ActivePlayer.Sign === "X");

        ExecutePlayerInteraction(publicApi.ActivePlayer, publicApi);
    }

    /* Activate the next player .. */
    publicApi.NextPlayer = () => {
        if (publicApi.ActivePlayer.Sign === "X") {
            publicApi.ActivePlayer = publicApi.PlayerO;
        } else {
            publicApi.ActivePlayer = publicApi.PlayerX;
        }

        performPlayerActivation();
    };

    /* Place the sign of the currently active player 
       at the given position. 
    */
    publicApi.PlaceSignAtPosition = (row, column) => {
        let boxes = $board.find(".box");
        let position = 3*(row-1) + (column-1); 
        $(boxes[position]).addClass(publicApi.ActivePlayer.PlayerSignCssClass);
    };

    /* Clear the board */
    publicApi.Clear = () => {
        let boxes = $board.find(".box");
        boxes.each((index, box) => {
            $(box).removeClass(publicApi.PlayerO.PlayerSignCssClass);
            $(box).removeClass(publicApi.PlayerX.PlayerSignCssClass);
        });

        // Reset to default player
        publicApi.ActivePlayer = publicApi.PlayerO;
        performPlayerActivation();
    }

    /* Get all boxes that are not assigned yet */
    publicApi.GetEmptyBoxes = () => {
        return $board.find(".box:not(.box-filled-1):not(.box-filled-2)");
    }

    /* Bootstrapping of the gameboard */
    publicApi.Clear();

    /* ---- */

    return publicApi;
}

let gameboard = Gameboard();

