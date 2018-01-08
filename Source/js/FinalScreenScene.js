/* ---- Final Screen */

function FinalScreenScene() {
    "use strict";
    const $finalScreen = $(".screen-win");
    let currentWinnerCssClass = undefined;

    return {
        SetTextAndCssClass : (text, winnerCssClass, playerName) => {
            let playerText = playerName + " won!";
            if ( playerName === undefined || playerName === "" ) {
                playerText = ""; 
            }
            $finalScreen.find(".message").text(text);
            $finalScreen.find(".smallerMessage").text(playerText)

            if ( currentWinnerCssClass !== undefined ) {
                $finalScreen.removeClass(currentWinnerCssClass);
            }

            $finalScreen.addClass(winnerCssClass);
            currentWinnerCssClass = winnerCssClass;
        },

        Run : (sceneManager) => {
            const $button = $finalScreen.find(".button");

            $button.on("click", () => {
                sceneManager.ShowScene("Gameboard");
                $button.off("click");
            });
        }
    }

}

SceneManager.RegisterScene({ Name: "FinalScreen", $DomElement : $("#finish"), SceneApi : FinalScreenScene() });
