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
