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
// .log( "Name" , getVar("ParticipantName") )
// This log command adds a column reporting the participant's name to every line saved to the results
.log("ParticipantID", PennController.GetURLParameter("participant") );
// This log command adds a column reporting the participant's name to every line saved to the results


newTrial( "intro" ,

    newText("Welcome to this experiment!")
        .css("font-size", "1.5em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newText("<strong>Informed Consent</strong>:")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("By clicking OK, you agree to the above. Let's get started!")
        .css("font-size", "1.5em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
/*    ,

    newText("<p>Please enter your name below and press enter:</p>")
        .css("font-size", "1.5em")
        .css("font-family", "Verdana")
        .center()
        .print()
    ,
    newTextInput()
        .center()
        .print()
        .wait()                 // The next command won't be executed until Enter is pressed
        .setVar( "ParticipantName" )
        // This setVar command stores the value from the TextInput element into the Var element */

) // intro message

newTrial("instructions" ,

    newText("<p>Your task in this experiment is to read sentences word by word.<br/>" +
        "You proceed to the next word by pressing the SPACE bar.</p>" +
        "<p>After reading a sentence, there will be a question about the sentence.</p>" +
        "<p>You answer the question by using the left and right arrow keys,</br>or by clicking on the arrows.")
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
        newText("Comprehension", row.Question)
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
    .log("ExpId", row.ExpId) // logs the experiment ID in multi-experimenter runs
    .log("Id", row.Id) // logs the stimulus ID
    .log("Group", row.Group) // which group were participants assigned
    .log("Corr", row.Corr) // was the correct comprehension button pressed?
    .log("Comp", row.Question) // which question was asked?
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

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
