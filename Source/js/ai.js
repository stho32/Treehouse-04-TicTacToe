/**
 * This function permutates through the possible next states of the game. 
 * It adds some meta information that we need to choose a nice next move.
 * 
 * @param {string} aiPlayerSign Sign of the player that the AI is playing. The sign is either X or O.
 */
function AI_CalculateNextSteps(aiPlayerSign) {
    let publicApi = {};

    /**
     * possibleMovesFromHere is the "result" that is generated via the permutations
     * we call AI. The info consists of a move info (place sign x at position y) and 
     * a point number determined by the needed count of moves, the count of the possible wins vs.
     * the count of the possible losses taking this direction.  
     */
    let possibleMovesFromHere = [];
    let activePlayer = aiPlayerSign;
    let iAmPlayer = aiPlayerSign;
    // We abort execution when reaching 2 seconds to stay responsive...
    let startTime = 0;
    let abortAtMs = 15000;

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
    
    /**
     * Permutate the possible moves and outcomes and collect them.
     * 
     * @param {string} start The boards state as string "X  OX ...", to be mutated.
     *                       Every recursive call changes this value.
     * @param {number} index Set a sign at that position
     * @param {string} player Either X or O, "you are that player at this moment", the sign to be set
     * @param {number} depth How deep are we into the tree of possibilities?
     * @param {number} firstNextMoveIndex In this method we explore possible options into depth. But when all calculation
     *                                    is done, we do not want to know, that there are final states X and Y but what
     *                                    is the exact next move to some day reach the desired final states.
     *                                    So while start is changed at every recursive call, we only generate "firstNextMove" 
     *                                    once upon the time and then remember it. It is the index for the possibleNextMoves
     *                                    array. 
     */
    function permutation(start, index, player, depth, firstNextMoveIndex) {
        // In case we have reached the time limit we stop execution here...
        let now = new Date().getTime();
        if ( (now-startTime) > abortAtMs ) {
            return;
        }
        // On depth 3 we break, we only need to envision a small amount of next moves
        // Actually, the ai even gets confused if we dig deeper. And then it will not prevent
        // the winning of the other player correctly.
        if ( depth === 3 ) {
            return;
        }

        // permutate ! 
        let myState = start;

        if (index !== undefined) {
            myState = replaceCharX(start, index, player);

            if ( firstNextMoveIndex === undefined ) {
                /* Right now we calculated the "firstNextMove", so we better remember it.
                */
                var myFirstNextMove = {
                    sign : player,
                    position: index,
                    points: 0
                };

                possibleMovesFromHere.push(myFirstNextMove);
                firstNextMoveIndex = possibleMovesFromHere.length-1;
            }
        }

        if ( firstNextMoveIndex !== undefined ) {
            // Do we have a winner?
            let winner = detectWinningSituation(myState);
            if ( winner !== "" ) {
                if (winner === iAmPlayer) possibleMovesFromHere[firstNextMoveIndex].points += 10;
                if (winner !== iAmPlayer) possibleMovesFromHere[firstNextMoveIndex].points -= 10;
                
                // end recursion
                return;
            }

            // Do we have a tie?
            if ( noFurtherEmptyPlaces(myState) ) {
                // end recursion
                return;
            }
        }

        let newPlayer = player;
        /* If we are in the first recursion layer there is no index found yet. 
        Then we do not want to change the player, as this turn is only for finding
        the next free spaces. 
        If we have an index, then the next player is the other player... 
        */
        if ( index !== undefined ) {
            if (player === "X") {
                newPlayer = "O";
            } else {
                newPlayer = "X";
            }
        }

        // We have neither a winning state nor a tie. Thus we permutate along
        // to find the next moves and calculate their points.
        for (let i = 0; i < myState.length; i ++) {
            if ( myState[i] === " " ) {
                permutation(myState, i, newPlayer, depth+1, firstNextMoveIndex);
            }
        }
    };

    publicApi.CalculatePossibleMoves = function(board) {
        startTime = new Date().getTime();

        possibleMovesFromHere = [];
        permutation(board, undefined, aiPlayerSign, 0, undefined);
        return possibleMovesFromHere;
    }

    publicApi.CalculateNextMove = function(board) {
        publicApi.CalculatePossibleMoves(board);

        /* Sort possible moves by descending points... 
        "Choose the most winning path." */
        possibleMovesFromHere.sort(function(a,b) {
            return b.points - a.points;
        });

        return possibleMovesFromHere[0];
    };

    return publicApi;
}

