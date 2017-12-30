/*
    Js Source Code for the TicTacToe Project

    github/stho32
*/


// "use strict"

const $board = $("#board");
const $startScreen = $("#start");
const $finalScreen = $(".screen-win");

function StartScreen() {
    const $startScreenButton = $("#screen-start-button");

    /* (R2) at startup the board is hidden and the start screen is displayed */
    function StartupScreenInteraction() {
        $board.hide()
        $finalScreen.hide();
        $startScreen.show();

        $startScreenButton.on("click", () => {
            $startScreen.hide();
            $finalScreen.hide();
            $board.show();
        });
    }

    return {
        Show : () => {
            StartupScreenInteraction();
        }
    }
}

function FinalScreen(gameboard) {

    function show(text, winnerCssClass) {
        $board.hide();
        $startScreen.hide();
        $finalScreen.show();
        $finalScreen.find(".message").text(text);
        $finalScreen.addClass(winnerCssClass);

        $finalScreen.find(".button").on("click", () => {
            // Start new game
            gameboard.Clear();

            $board.show();
            $startScreen.hide();
            $finalScreen.hide();
            $finalScreen.removeClass(winnerCssClass);
        });
    }

    return {
        Show : show
    }

}


/* The Player class encapsulates the interaction 
   between player state and UI.
*/
function Player(id, sign, playerType, winCssClass) {
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
        PlayerSignCssClass: playerSignCssClass,
        PlayerType: playerType,
        WinCssClass: winCssClass,
        HoverEffectCssClass: boxEmptyCssClass
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
            if (isActive) {
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
        emptyBoxes.off("click");

        let $box = $(event.target);

        let row = $box.data("row");
        let column = $box.data("column");

        // 3. place sign
        gameboard.PlaceSignAtPosition(row, column);

        // 4. give control back to the gameboard 
        gameboard.ContinueGameplay();
    });
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

    if (player.PlayerType === "human") return HumanPlayerInteraction(player, gameboard);
    if (player.PlayerType === "computer") return ComputerPlayerInteraction(player, gameboard);

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
    publicApi.PlayerO = Player(1, "O", "human", "screen-win-one");
    publicApi.PlayerX = Player(2, "X", "human", "screen-win-two");
    publicApi.ActivePlayer = publicApi.PlayerO;
    /* --- */

    /* Activate the "activePlayer", deactivate the other one */
    function performPlayerActivation() {
        publicApi.PlayerO.setActive(publicApi.ActivePlayer.Sign === "O");
        publicApi.PlayerX.setActive(publicApi.ActivePlayer.Sign === "X");

        ExecutePlayerInteraction(publicApi.ActivePlayer, publicApi);
    }

    /* External components (player interaction models) use this
       function to continue with the rest of the game flow.
    */
    publicApi.ContinueGameplay = () => {
        /* Do we have a winner? */
        let winner = publicApi.WhoIsTheWinner();

        if (winner !== false) {
            let finalScreen = FinalScreen(publicApi);
            finalScreen.Show("Winner", winner.WinCssClass);
            return;
        } 

        if (publicApi.AreAllBoxesFilled()) {
            let finalScreen = FinalScreen(publicApi);
            finalScreen.Show("It's a Tie!", "screen-win-tie");
            return;
        }

        /* No? Then continue with the next player... */
        publicApi.NextPlayer();
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
        let position = 3 * (row - 1) + (column - 1);
        $(boxes[position]).addClass(publicApi.ActivePlayer.PlayerSignCssClass);
    };

    /* Clear the board */
    publicApi.Clear = () => {

        let boxes = $board.find(".box");

        boxes.each((index, box) => {
            // Remove all set signs
            $(box).removeClass(publicApi.PlayerO.PlayerSignCssClass);
            $(box).removeClass(publicApi.PlayerX.PlayerSignCssClass);

            // Remove all effects
            $(box).removeClass(publicApi.PlayerO.HoverEffectCssClass);
            $(box).removeClass(publicApi.PlayerX.HoverEffectCssClass);

            // And in case we still have some event handlers
            // lurking around, shut them down.
            $(box).off("click");
        });

        // Reset to default player
        publicApi.PlayerO.setActive(false);
        publicApi.PlayerX.setActive(false);
        publicApi.ActivePlayer = publicApi.PlayerO;
        performPlayerActivation();
    }

    /* Get all boxes that are not assigned yet */
    publicApi.GetEmptyBoxes = () => {
        return $board.find(".box:not(.box-filled-1):not(.box-filled-2)");
    }

    /* Find out if all boxes are filled. */
    publicApi.AreAllBoxesFilled = () => {
        return publicApi.GetEmptyBoxes().length === 0;
    };


    /* Uses a list of coordinates to validate, if there is a 
       specific css class in every selected box. Using this function
       we can check if and what part of the winning conditions
       is fulfilled. */
    function IsBoxSetComplete(boxCoordinates, expectedCssClass) {
        let complete = true;
        let boxes = $board.find(".box");

        boxCoordinates.forEach(coordinate => {
            let coordinateAsIndex = (coordinate.row-1) * 3 + (coordinate.column-1);
            complete = complete && $(boxes[coordinateAsIndex]).hasClass(expectedCssClass);
        });

        return complete;
    }

    /* Detect if the given player has won. */
    function playerHasWon(player) {
        let signCssClass = player.PlayerSignCssClass;

        // the 3 rows
        if (IsBoxSetComplete([{ row: 1, column: 1 }, { row: 1, column: 2 }, { row: 1, column: 3 }], signCssClass)) return true;
        if (IsBoxSetComplete([{ row: 2, column: 1 }, { row: 2, column: 2 }, { row: 2, column: 3 }], signCssClass)) return true;
        if (IsBoxSetComplete([{ row: 3, column: 1 }, { row: 3, column: 2 }, { row: 3, column: 3 }], signCssClass)) return true;

        // the 3 columns
        if (IsBoxSetComplete([{ row: 1, column: 1 }, { row: 2, column: 1 }, { row: 3, column: 1 }], signCssClass)) return true;
        if (IsBoxSetComplete([{ row: 1, column: 2 }, { row: 2, column: 2 }, { row: 3, column: 2 }], signCssClass)) return true;
        if (IsBoxSetComplete([{ row: 1, column: 3 }, { row: 2, column: 3 }, { row: 3, column: 3 }], signCssClass)) return true;

        // the 2 diagonals
        if (IsBoxSetComplete([{ row: 1, column: 1 }, { row: 2, column: 2 }, { row: 3, column: 3 }], signCssClass)) return true;
        if (IsBoxSetComplete([{ row: 1, column: 3 }, { row: 2, column: 2 }, { row: 3, column: 1 }], signCssClass)) return true;

        return false;
    }

    /* Find out if the "win" condition is met and if, for whom. 
       @returns: the winner or false
    */
    publicApi.WhoIsTheWinner = () => {

        if (playerHasWon(publicApi.PlayerX)) return publicApi.PlayerX;
        if (playerHasWon(publicApi.PlayerO)) return publicApi.PlayerO;

        return false;
    };


    /* Bootstrapping of the gameboard */
    publicApi.Clear();

    /* ---- */

    return publicApi;
}

let startscreen = StartScreen();
let gameboard = Gameboard();
startscreen.Show();
