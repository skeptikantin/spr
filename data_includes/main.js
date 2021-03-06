// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of available elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null); // Shorten command names (keep this line here)
PennController.DebugOff();


// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'
Sequence( "intro",
    "instructions",
    "training",
    "intermission",
    sepWithN("break", randomize("experiment"), 6),
    "debrief",
    SendResults(),
    "goodbye")


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
// This log command adds a column reporting the participant's name to every line saved to the results
.log("ParticipantID", PennController.GetURLParameter("participant") );

newTrial("intro",

    newText("<p>Welcome!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can work uninterrupted.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>By hitting SPACE I consent to the above.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
)
newTrial("instructions" ,

    newText("<p><strong>The self-paced reading experiment</strong></p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Your task is to read sentences word by word. Each word appears on the screen,<br/>" +
        "until you press the <strong>space</strong> bar, which is when the next word appears.</p>" +
        "<p>After you have read the sentence, there will be a question about the sentence.<br/>" +
        "You answer the question by using the <strong>left</strong> or <strong>right</strong> arrow key.")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>So the aim is to read as quickly as possible, but you will need to be accurate on the question, too.<br/>"+
        "So make sure you understand what you are reading.</p>"+
        "<p>We will start with a few practice sentences so you can get used to the task.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Click OK when you are ready to begin the training phase.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
) // instructions

// set up the training phase
Template("training.csv", row =>
    newTrial("training",

        newController("DashedSentence", {s: row.Sentence})
            .css("font-size", "1.5em")
            .css("font-family", "Verdana")
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
            .css("font-size", "1.5em")
            .css("font-family", "Verdana")
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
/*
        newSelector("lr")
            .add(getImage("left"), getImage("right"))
            .keys(37, 39)
            .log()
            .once()
            .wait()
        ,
*/
        newKey("key", "ArrowLeft", "ArrowRight")
            .wait()
            .log()
        ,

        getKey("key")
            .test.pressed(row.Corr)
            .success(newText("success", "Correct!").css("font-color", "green").center().print())
            .failure(newText("failure", "Incorrect!").css("font-color", "red").center().print())
        ,
        newTimer(500)
            .start()
            .wait()

)
        .log("ExpId", row.ExpId) // logs the experiment ID in multi-experimenter runs
        .log("Id", row.Id) // logs the stimulus ID
        .log("Group", row.Group) // which group were participants assigned
        .log("Corr", row.Corr) // was the correct comprehension button pressed?
)

// Intermission
newTrial("intermission",

    newText("<p>Well done, you should be good to go.<br/>" +
        "Remember: try to be quick <strong>and</strong> accurate.</p>" +
        "<p>Some sentences and/or questions will be easier than others,<br/>"+
        "so please pay close attention to what you are reading.</p>" +
        "<p>The task is mostly fun, but also demanding,<br/>" +
        "so there are designated breaks every 6 sentences if you want.<br/></p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("(Please do not take a break <em>while</em> reading a sentence.)")
        .print()
    ,
    newText("<p>Click OK when you are ready to proceed to the main experiment.</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("OK")
        .size(100)
        .center()
        .print()
        .wait()
)

//

Template("sentences.csv", row =>
    newTrial("experiment",
        
        newController("DashedSentence", {s: row.Sentence})
            .css("font-size", "1.5em")
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
            .css("font-size", "1.5em")
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
        newSelector()
            .add(getImage("left"), getImage("right"))
            .keys(37, 39)
            .log()
            .once()
            .wait()
    )
        .log("ExpId", row.ExpId) // logs the experiment ID in multi-experimenter runs
        .log("Id", row.Id) // logs the stimulus ID
        .log("Group", row.Group) // which group were participants assigned
        .log("Corr", row.Corr) // was the correct comprehension button pressed?
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )
) // defines template for the main experiment

newTrial("debrief",

    newText("<p>That's (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Before you go, let us know if you have any feedback.<br/>" +
        "This information will help us with the evaluation of the results.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newTextInput("feedback", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,
    newText("<p>What do you think the experiment was about?</p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newTextInput("topic", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,

    newText("<p> </p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newButton("send", "Send results & proceed to verification link")
        .size(300)
        .center()
        .print()
        .wait()
)


SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>That's it, thank you very much for your time and effort!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Our feedback</strong>: The task you just did tries to measure how we process sentences<br/>"+
        "of varying (presumed) complexity. Trivially, more complex sentences take longer to read, but complexity<br/>"+
        "comes in various forms and can be located in different parts of a sentence. Reading experiments<br/>"+
        "help us learn more about how people understand and process language (well at least a tiny bit!).</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<strong><a href='https://app.prolific.co/submissions/complete?cc=6DB340D0'>Click here to return to Prolific to validate your participation.</a></strong>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><br/>You can contact the corresponding researcher <a href='https://www.sfla.ch/' target='_blank'>here</a> (opens new tab).</p>")
        .css("font-size", ".8em")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("void")
        .wait()
) // the good-bye message

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial

// Define the function for breaking experiment at N intervals:
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

_AddStandardCommands(function(PennEngine){
    this.test = {
        passed: function(){
            return !PennEngine.controllers.running.utils.valuesForNextElement ||
                !PennEngine.controllers.running.utils.valuesForNextElement.failed
        }
    }
});