/*
    Js Source Code for the TicTacToe Project

    github/stho32
*/

(() => {
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
})();