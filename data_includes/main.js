// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of availalbe elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
PennController.DebugOff();


// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'
Sequence( "intro", "instructions", "fullscreen", randomize("spr") , SendResults() , "goodbye" )


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(750)
        .start()
        .wait()
)
.log( "Name" , getVar("ParticipantName") )
// This log command adds a column reporting the participant's name to every line saved to the results


newTrial( "intro" ,

    newText("Welcome to suz’ demo experiment.")
        .css("font-size", "2em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newText("<p>Please enter your name below and press enter:</p>")
        .css("font-size", "1.5em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newTextInput()
        .center()
        .print()
        .wait()                 // The next command won't be executed until Enter is pressed
        .setVar( "ParticipantName" )
        // This setVar command stores the value from the TextInput element into the Var element
) // intro message

newTrial("instructions" ,

    newText("<p>In this experiment you are going to read sentences word by word.<br/>You can proceed to the next word by pressing the SPACE bar.</p><p>After reading a sentence, there will be a question about the sentence.</p><p>You can answer the question by using the left and right arrow keys,</br>or by clicking on the arrows.")
        .css("font-size", "1.5em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newText("<p>Click OK when you are ready to begin.</p>")
        .css("font-size", "1.5em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newButton("OK")
        .size(200)
        .center()
        .print()
        .wait()
) // instructions

//newTrial("fullscreen",
//  newButton("Start the experiment and go fullscreen!")
//    .print()
//    .wait()
//  ,
//  fullscreen()
//)

Template("sentences.csv", row =>
    newTrial("spr",
        
        newController("DashedSentence", {s: row.Sentence})
            .css("font-size", "2em")
            .css("font-family", "Open Sans")
            .print()
            .log()
            .wait()
            .remove()
        ,
        newTimer(500)
            .start()
            .wait()
        ,
        newImage("left", "left.png")
            .size(50,30)
            // .print()
        ,
        newImage("right", "right.png")
            .size(50,30)
            // .print()
        ,
        newText("<p></p>")
            .print()
        ,
        newText("Comprehension", row.Q)
            .css("font-size", "2em")
            .css("font-family", "Open Sans")
            .center()
            .print()
            .log()
            //.wait()
        ,
        newCanvas(600,200)
            .add(200, 50, getImage("left"))
            .add(350, 50, getImage("right"))
            .center()
            .print()
        ,
    //    newKey("FJ")
        newSelector()
            .add(getImage("left"), getImage("right"))
            .keys(37, 39)
            .log()
            .once()
            .wait()
    )
    //.fullscreen()
    .log("Corr", row.Corr)
    .log("Comp", row.Q)
) // defines template for the main experiment

SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>Thank you for your participation!</p>")
        .css("font-size", "2em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newText("<a href='https://www.sfla.ch/'>Click here to validate your participation.</a>")
        .css("font-size", "1.5em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    //exitFullscreen(),
    newButton("void")
        .wait()
) // the good-bye message

// Spaces and linebreaks don't matter to the script: we've only been using them for the sake of readability
newTrial( "bye" ,
    newText("Thank you for your participation!")
        .css("font-size", "2em")
        .css("font-family", "Open Sans")
        .center()
        .print()
    ,
    newButton().wait()  // Wait for a click on a non-displayed button = wait here forever
)
.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
