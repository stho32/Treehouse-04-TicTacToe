/*
    This function here is the global scene control. 
    The scene manager is our IoC container for scenes.

    It's a singleton because we only have one...
*/
const SceneManager = (function() {
    "use strict";

    let publicApi = {};

    let sceneRegistry = [];
    let currentScene = undefined;

    /* Register a game scene */
    publicApi.RegisterScene = (scene) => {
        // Example scene code: 
        // const StartScene = { Name: "StartScreen", $DomElement : $("#board"), SceneApi : StartScreenScene };
        sceneRegistry.push(scene);
    }

    /* Activate a specific game scene */
    publicApi.ShowScene = (sceneName) => {
        /* Deactivate/Hide the current scene */
        if ( currentScene !== undefined ) {
            console.log("Current scene " + currentScene.Name + " is shut down...");
            currentScene.$DomElement.hide();
        }

        for ( let i = 0; i < sceneRegistry.length; i++ ) {
            let scene = sceneRegistry[i];

            if ( scene.Name === sceneName ) {
                console.log("Activating scene " + sceneName + "...");
                /* Activate new current scene */
                currentScene = scene;
                currentScene.$DomElement.show();
                /* Start the main function for the scene and pass myself into it, so 
                that the scene can control the jump to the next scene. */
                scene.SceneApi.Run(publicApi);

                return;
            }
        }

        alert("The code requested scene "+ scene + " which unfortunately is unknown.");
    }

    /* In case a scene needs to communicate with another scene
    it can request to get access to the scenes API. */
    publicApi.GetSceneApi = (sceneName) => {

        for ( let i = 0; i < sceneRegistry.length; i++ ) {
            let scene = sceneRegistry[i];

            if ( scene.Name === sceneName ) {
                return scene.SceneApi;
            }
        }

        alert("The code requested scene " + scene + " which unfortunately is unknown.");
    }

    /* Initialization when all scenes are registered and we are about to start... */
    publicApi.Initialize = () => {
        /* Hide all Scenes :) */
        for ( let i = 0; i < sceneRegistry.length; i++ ) {
            let scene = sceneRegistry[i];
            scene.$DomElement.hide();
        }
    }

    return publicApi;
})();
