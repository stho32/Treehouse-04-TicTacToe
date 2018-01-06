QUnit.test( "replacing chars works as expected", function( assert ) {
    let ai = AI_CalculateNextSteps("", "");

    assert.ok( "XOO" === ai.ReplaceCharX("OOO", 0, "X"), "The char is replaced." );
    assert.ok( "OXO" === ai.ReplaceCharX("OOO", 1, "X"), "The char is replaced." );
    assert.ok( "OOX" === ai.ReplaceCharX("OOO", 2, "X"), "The char is replaced." );
});

QUnit.test( "NoFurtherEmptyPlaces returns true if there are no spaces left in the string", function(assert) {
    let ai = AI_CalculateNextSteps("", "");

    assert.ok(ai.NoFurtherEmptyPlaces(" ") === false, "Input is a space so false is returned");
    assert.ok(ai.NoFurtherEmptyPlaces("") === true, "Input has no space so true is returned");
    assert.ok(ai.NoFurtherEmptyPlaces(" XO") === false, "Input has a space so false is returned");
    assert.ok(ai.NoFurtherEmptyPlaces("OXO") === true, "Input has no space so true is returned");
});

QUnit.test("DetectWinningSituation recognizes winning rows", function(assert) {
    let ai = AI_CalculateNextSteps("", "");

    assert.ok(ai.DetectWinningSituation("OOO      ") === "O", "O wins");
    assert.ok(ai.DetectWinningSituation("   OOO   ") === "O", "Second row, O wins");
    assert.ok(ai.DetectWinningSituation("      OOO") === "O", "Third row, O wins");

    assert.ok(ai.DetectWinningSituation("XXX      ") === "X", "X wins");
    assert.ok(ai.DetectWinningSituation("   XXX   ") === "X", "Second row, X wins");
    assert.ok(ai.DetectWinningSituation("      XXX") === "X", "Third row, X wins");

    assert.ok(ai.DetectWinningSituation("         ") === "", "No winner");
});

QUnit.test("DetectWinningSituation recognizes winning columns", function(assert) {
    let ai = AI_CalculateNextSteps("", "");

    assert.ok(ai.DetectWinningSituation("O  O  O  ") === "O", "O wins");
    assert.ok(ai.DetectWinningSituation(" O  O  O ") === "O", "Second column, O wins");
    assert.ok(ai.DetectWinningSituation("  O  O  O") === "O", "Third column, O wins");

    assert.ok(ai.DetectWinningSituation("X  X  X  ") === "X", "X wins");
    assert.ok(ai.DetectWinningSituation(" X  X  X ") === "X", "Second column, X wins");
    assert.ok(ai.DetectWinningSituation("  X  X  X") === "X", "Third column, X wins");
});

QUnit.test("DetectWinningSituation recognizes winning diagonals", function(assert) {
    let ai = AI_CalculateNextSteps("", "");

    assert.ok(ai.DetectWinningSituation("O   O   O") === "O", "O wins, diagonal 1");
    assert.ok(ai.DetectWinningSituation("  O O O  ") === "O", "O wins, diagonal 2");

    assert.ok(ai.DetectWinningSituation("X   X   X") === "X", "X wins, diagonal 1");
    assert.ok(ai.DetectWinningSituation("  X X X  ") === "X", "X wins, diagonal 2");
});


QUnit.test("CalculatePossibleMoves : On board XXO OOX XO  only 1 move is possible and its useless (points===0)", function(assert) {
    let nextMoves = AI_CalculateNextSteps("X").CalculatePossibleMoves(
        "XXO" +
        "OOX" + 
        "XO "
    );

    assert.ok(nextMoves.length === 1, "There is only one move possible.");
    assert.ok(nextMoves[0].sign === "X", "Its the AI's move." );
    assert.ok(nextMoves[0].points === 0, "Its a useless move (tie).");
    assert.ok(nextMoves[0].position === 8, "8 is the index of the last column in the last row.")
});

QUnit.test("CalculatePossibleMoves : On board XOO OXO XO  only 1 move is possible and its a win (points===10)", function(assert) {
    let nextMoves = AI_CalculateNextSteps("X").CalculatePossibleMoves(
        "XOO" +
        "OXO" + 
        "XO "
    );

    assert.ok(nextMoves.length === 1, "There is only one move possible.");
    assert.ok(nextMoves[0].sign === "X", "Its the AI's move." );
    assert.ok(nextMoves[0].points === 10, "Its a winning move.");
    assert.ok(nextMoves[0].position === 8, "8 is the index of the last column in the last row.")
});

QUnit.test("CalculatePossibleMoves : On board XOO OXO X   2 moves are possible, one is a win for the other guy", function(assert) {
    let nextMoves = AI_CalculateNextSteps("X").CalculatePossibleMoves(
        "XOO" +
        "OXO" + 
        "X  "
    );

    assert.ok(nextMoves.length === 2, "Two moves are possible.");

    assert.ok(nextMoves[0].sign === "X", "Its the AI's move." );
    assert.ok(nextMoves[0].position === 7, "Placing the X on position 7...")
    assert.ok(nextMoves[0].points === -10, "...looses you the game");

    assert.ok(nextMoves[1].sign === "X", "Its the AI's move." );
    assert.ok(nextMoves[1].position === 8, "Placing the X on position 8...")
    assert.ok(nextMoves[1].points === 10, "...wins you the game");
});

QUnit.test("CalculateNextMove : On board XOO OXO X   get me the winning move!", function(assert) {
    let move = AI_CalculateNextSteps("X").CalculateNextMove(
        "XOO" +
        "OXO" + 
        "X  "
    );

    assert.ok(move.sign === "X", "Its the AI's move." );
    assert.ok(move.position === 8, "Placing the X on position 8...")
    assert.ok(move.points === 10, "...wins you the game");
});
