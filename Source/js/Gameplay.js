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
    // maybe I can refactor this later, but at the moment, I need that board reference here... 
    const $board = $("#board");

    /* These functions and properties can 
    be used from outside. */
    let publicApi = {
        Id: id,
        Sign: sign,
        PlayerSignCssClass: playerSignCssClass,
        PlayerType: playerType,
        WinCssClass: winCssClass,
        HoverEffectCssClass: boxEmptyCssClass,
        Name : "<Anonymous>"
    };

    /* Activate and deactivate player 
    
    - show active state in the header of the game screen
    - toggle the boxEmptyCssClass on all empty boxes, so that 
        it looks like we want to place the players sign everywhere.
    */
    publicApi.setActive = (active) => {
        // Display name correctly
        $board.find(".player" + id + "Name").text(publicApi.Name);
        if ( publicApi.PlayerType === "computer" ) {
            $board.find(".player" + id + "Name").text(publicApi.Name + " (computer)");
        }

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
        // setTimeout helps us to update the UI ("just leave js for a bit and come back") 
        window.setTimeout(gameboard.ContinueGameplay, 100);
    });
}


/* This is how a computer player makes a move. */
function ComputerPlayerInteraction(player, gameboard) {
    console.log("Computer moves...");

    // 1. activate some animation that tells the user to wait
    let $playerSign = $("#player" + player.Id + " svg");
    $playerSign.addClass("Computerplayer-Thinking");

    window.setTimeout(() => {
        // 2. calculate and think
        // 2.1 translate the board for the AI
        let board = gameboard.GetBoardAsString();
        let ai = AI_CalculateNextSteps(player.Sign);
        let move = ai.CalculateNextMove(board);
        // 3. place sign 
        // We need to translate the position of the AI to the column/row info we need on the 
        // board. 
        console.log(move);
        let row = Math.floor(move.position / 3);
        let column = move.position - (3*row);
        row +=1;
        column +=1;
        console.log("Row:" + row.toString() + " Col: " + column.toString());
        gameboard.PlaceSignAtPosition(row, column);

        console.log("complete.");
        $playerSign.removeClass("Computerplayer-Thinking");
        // 4. give control back to the gameboard ("next player")
        // setTimeout helps us to update the UI ("just leave js for a bit and come back") 
        window.setTimeout(gameboard.ContinueGameplay, 100);
    }, 1000);
}

/* "make a move" */
function ExecutePlayerInteraction(player, gameboard) {

    if (player.PlayerType === "human") return HumanPlayerInteraction(player, gameboard);
    if (player.PlayerType === "computer") return ComputerPlayerInteraction(player, gameboard);

    alert("I do not know what player type " + player.PlayerType + " is. I do not know how to let it interact properly. Please add amazing source code to me to solve the problem.");
}
