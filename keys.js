// The myKeys object will be in the global scope - it makes this script 
// really easy to reuse between projects

"use strict";

var app = app || { };

app.myKeys = function() {
    
    var myKeys = {};

    myKeys.KEYBOARD = Object.freeze({
        "KEY_LEFT": 37, 
        "KEY_UP": 38, 
        "KEY_RIGHT": 39, 
        "KEY_DOWN": 40,
        "KEY_SPACE": 32,
        "KEY_SHIFT": 16,
        "KEY_PAUSE": 80
    });

    // myKeys.keydown array to keep track of which keys are down
    // this is called a "key daemon"
    // main.js will "poll" this array every frame
    // this works because JS has "sparse arrays" - not every language does
    myKeys.keydown = [];


    // event listeners
    window.addEventListener("keydown", function (e) {
        // right arrow key
        if (e.keyCode == 39) {
            //console.log("keydown=" + e.keyCode);
            myKeys.keydown[e.keyCode] = true;
        }
        // left arrow key
        else if (e.keyCode == 37) {
            console.log("left");
            //console.log("keydown=" + e.keyCode);
            myKeys.keydown[e.keyCode] = true;
        }
    });
    window.addEventListener("keyup", function (e) {
        // right arrow key
        if (e.keyCode == 39) {
            //this.moveRight = false;
            //console.log("keyup=" + e.keyCode);
            myKeys.keydown[e.keyCode] = false;
        }
        // left arrow key
        else if (e.keyCode == 37) {
            //this.moveLeft = false;
            //console.log("keyup=" + e.keyCode);
            myKeys.keydown[e.keyCode] = false;
        }
    });

    return myKeys;
}()