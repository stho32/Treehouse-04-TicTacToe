/*
    AI Test Environment

    This file is for testing only.
*/

/**
 * This function permutates through the possible next states of the game. 
 * It adds some meta information that we need to choose a nice next move.
 * 
 * @param {string} boardAsString The gameboard represeted as one continuous string of the characters "XO ".
 * @param {string} aiPlayerSign Sign of the player that the AI is playing. The sign is either X or O.
 */
function AI_CalculateNextSteps(boardAsString, aiPlayerSign) {
    let publicApi = {};

    let start = boardAsString;
    let possibleMovesFromHere = [];
    let activePlayer = aiPlayerSign;

    /* We want to return a new string that contains our new
       choosen character at position <index>.
    */
    function replaceCharX(text, index, newChar) {
        return text.substring(0, index) + newChar + 
               text.substring(index +1);
    }
    
    publicApi.ReplaceCharX = replaceCharX;
    
    /* Thats how we detect a final state. If there are no 
       empty places left on a board then its done. */
    function noFurtherEmptyPlaces(text) {
        // if this command does not change the string length then
        // we have no spaces left.
        return (text.length === text.replace(" ", "").length)
    }

    publicApi.NoFurtherEmptyPlaces = noFurtherEmptyPlaces;

    /* Even before we hit the possible "all places taken", we might encounter
       a winning situation. Although there are still whitespaces
       they are final states.

       @returns {string} X or O or empty string, depending on if a winner is found
    */
    function detectWinningSituation(board) {
        function containsOnly(text, sign) {
            if ( text.length === 0 )
                return false;

            return text.replace(new RegExp(sign,"g"), "") === "";
        }

        // Rows, Columns and Diagonals...
        let sequences = [];
        // Rows
        sequences.push( board[0] + board[1] + board[2] );
        sequences.push( board[3] + board[4] + board[5] );
        sequences.push( board[6] + board[7] + board[8] );
        // Columns
        sequences.push( board[0] + board[3] + board[6] );
        sequences.push( board[1] + board[4] + board[7] );
        sequences.push( board[2] + board[5] + board[8] );
        // Diagonals
        sequences.push( board[0] + board[4] + board[8] );
        sequences.push( board[2] + board[4] + board[6] );

        let result = ""; 

        ["X", "O"].forEach( sign => {
            sequences.forEach( sequence => {
                if ( containsOnly(sequence, sign) ) return result = sign;
            });
        });

        return result;
    }

    publicApi.DetectWinningSituation = detectWinningSituation;
     

    function permutation(start, index, player) {
        //console.log("Its players " + player + " turn: " + start);
        let myState = start;

        if (index !== undefined) {
            let newPlayer = player;
            if (player === "X") {
                newPlayer = "O";
            } else {
                newPlayer = "X";
            }
                
            myState = replaceCharX(start, index, player);
        }

        let winner = detectWinningSituation(myState);

        if ( noFurtherEmptyPlaces(myState) ) {
            console.log("final state : " + myState);
        } else {
            for (let i = 0; i < myState.length; i ++) {
                if ( myState[i] === " " ) {
                    permutation(myState, i, newPlayer);
                }
            }
        }
    };

    return publicApi;
}


