/*
    Js Source Code for the TicTacToe Project

    github/stho32
*/

(function() {
    "use strict";

    /* ---- Start Screen */
    function StartScreenScene() {
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

    /* ---- Final Screen */

    function FinalScreenScene() {
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

    /* ---- Gameboard Scene */

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


    /* The Gameboard: Two players & game state
    as well as UI interaction.
    */
    function GameboardScene() {
        /* Safe place for the scene manager in this very complex scene ... */
        let SceneManager = undefined;

        /* Main DOM Element */
        const $board = $("#board");

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

        publicApi.SetPlayer1 = (name, type) => {
            publicApi.PlayerO.Name = name;
            publicApi.PlayerO.PlayerType = type;
        };

        publicApi.SetPlayer2 = (name, type) => {
            publicApi.PlayerX.Name = name;
            publicApi.PlayerX.PlayerType = type;        
        };

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

            let finalScreenScene = SceneManager.GetSceneApi("FinalScreen");

            if (winner !== false) {

                finalScreenScene.SetTextAndCssClass("Winner", winner.WinCssClass, winner.Name);
                SceneManager.ShowScene("FinalScreen");

                return;
            } 

            if (publicApi.AreAllBoxesFilled()) {

                finalScreenScene.SetTextAndCssClass("It's a Tie!", "screen-win-tie");
                SceneManager.ShowScene("FinalScreen");

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

        publicApi.GetBoardAsString = () => {
            let result = "";
            let boxes = $board.find(".box");

            for(let i = 0; i < boxes.length; i++ ) {
                // Box with O as O
                if ( $(boxes[i]).hasClass(publicApi.PlayerO.PlayerSignCssClass) ) {
                    result += publicApi.PlayerO.Sign;
                    continue;
                }
                // Box with X as X
                if ( $(boxes[i]).hasClass(publicApi.PlayerX.PlayerSignCssClass) ) {
                    result += publicApi.PlayerX.Sign;
                    continue;
                }
                // Empty box
                result += " ";
            }

            return result;
        }


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
        publicApi.Run = (sceneManager) => {
            SceneManager = sceneManager;
            publicApi.Clear();
        }

        /* ---- */

        return publicApi;
    }

    SceneManager.RegisterScene({ Name: "Gameboard", $DomElement : $("#board"), SceneApi : GameboardScene() });

    /* GO! */
    SceneManager.Initialize();
    SceneManager.ShowScene("StartScreen");
})();