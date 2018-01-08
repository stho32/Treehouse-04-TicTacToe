/* ---- Start Screen */
function StartScreenScene() {
    "use strict";
    const $startScreenButton = $("#screen-start-button");

    return {
        Run : (sceneManager) => {
            /* When someone clicks the start button on the start
            screen we switch to the Gameboard scene. */
            $startScreenButton.on("click", () => {
                $startScreenButton.off("click");

                let playerName1 = $(".PlayerRegistrations #player1Name").val();
                let playerType1 = $("#player1TypeHuman").is(":checked")?"human":"computer";

                let playerName2 = $(".PlayerRegistrations #player2Name").val();
                let playerType2 = $("#player2TypeHuman").is(":checked")?"human":"computer";

                /* Tell the gameboard about the name and player type selections... */
                let gameboard = sceneManager.GetSceneApi("Gameboard");

                gameboard.SetPlayer1(playerName1, playerType1);
                gameboard.SetPlayer2(playerName2, playerType2);

                sceneManager.ShowScene("Gameboard");
            });
        }
    }
}

SceneManager.RegisterScene({ Name: "StartScreen", $DomElement : $("#start"), SceneApi : StartScreenScene() });
