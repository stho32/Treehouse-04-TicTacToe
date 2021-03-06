# Tic Tac Toe

This is the 4th project for the team treehouse techdegree as a javascript full stack developer.

See [requirements](Documentation/Requirements.md) for the instructions.

The folder "Provided-Files" contains the files like teamtreehouse provided them for the project.

You might also be interested in my [notes](Documentation/Notes.md) where I share my thoughts about why I chose one way of solution over another. 

Click [here](https://stho32.github.io/Treehouse-04-TicTacToe/Source/index.html) to review the resulting page.
Click [here](https://stho32.github.io/Treehouse-04-TicTacToe/Source-AI/tests.html) to run the ai unit tests.

In a nutshell, this project is about creating a tic-tac-toe game. A game that shall be playable
against another person on the computer or a computer agent. Treehouse provided a few links and 
some nice styling and a few awesome UI mockups.


I try to become better at measuring and guessing time. For an insight into what I did and how long it took you may have fun looking at my [pomodoro-log](Documentation/Pomodoro-Log.md)

**Finishing the code according to the requirements took me about 11 hours in total, which I found and spent over a much longer calender time.**

## About the SceneManager

After coding for some time I had the feeling that I should refactor a few things. The screens felt like "scenes" to me. So this is what I did :

The start screen, the final screen and the game board are now "Scenes". A scene manager knows them all (they are registered).

And every scene has the ability to access the scene manager. So every scene can start any other scene, although it does not know what is actually
needed to start a specific scene. 

Of course every scene knows what it should do to start up and shut down.

This way the scenes are completely separate.

Still, using the SceneManager that is available to every scene, every scene can get access to the api of every other scene. 
This way, if needed, Scenes can also talk to each other. This is used by the gameboard scene to tell the final scene 
who the winner is.

So it's kind of an IoC container.

## About the computer player

I was looking for a specific model that enables the possibility for human and computer players. Without doing too much extra work.

The way I solved the problem is that every "Player object" knows if its human or computer. 

At a specific time in the execution the program needs the input of a "Player" which is essentially solved by calling a function 
that, when it is satisfied, calls the ContinueGameplay() function of the GameboardScene. 

Humans and Computers of cause have different functions and are satisfied at a different moment. 
While humans have to click an empty box, computers need to compute. 

The only place that knows which function to call depending on the player type is "ExecutePlayerInteraction".

Funny enough this way I can realize even computer against computer games :).

## About the global variable restrictions of the project as imposed by TeamTreehouse

I respect the need for a low amount of global variables. Still I had loved to split the code over multiple files to make it more readable...

## Post Assessment Refactoring

After being reviewed and since I have my "mark" now, I can do some refactorings that I'd like very much. If you want to go back to the state I got my Review with, you can always do so by visiting the state of the repository at change 44 https://github.com/stho32/Treehouse-04-TicTacToe/tree/711348b28305fab661152d7cc4131c6cc2669658.

 - AI is a separate file now and placed in the source directory. The tests in the Source-AI folder are changed to use that file instead of the now-deleted own copy. The game and the tests use the same file now.
 - Separated out the SceneManager as an own file, since its not really part of the game logic.
 

