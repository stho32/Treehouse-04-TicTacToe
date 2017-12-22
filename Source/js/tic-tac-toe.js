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

function Player(id, sign) {
    let $headerSign = $("#player" + id);
    let isActive = false;

    let publicApi = {
        Id : id,
        Sign: sign
    };

    publicApi.setActive = (active) => {
        isActive = active;

        $headerSign.toggleClass("active");
    };

    return publicApi;
}

let playerO = Player(1, "O");
let playerX = Player(2, "X");

playerO.setActive(true);

