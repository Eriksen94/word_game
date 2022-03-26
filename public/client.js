//sutom - 6-8 letters, common french word, 6 guesses 
//red = correct
//orange = letter is used, different space
//blue (default) = not used

/********************************************************************/
/**************************Setup variables***************************/
/********************************************************************/
let debug = false;
const MAX_GUESSES = 6;
let currentGuess = 0;
let matchingSpace = "#FF0000";
let matchingLetter = "#FFA500";
//WORDS_FR from separate list file

//time stuff
let today = new Date();
let now = Date.now();
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let nextDayMs = 8.64e7 - (today - 8.64e7 * Math.floor(today/8.64e7)); //UTC time
nextDayMs = nextDayMs + today.getTimezoneOffset()*60*1000; //adjust for local time (midnight reset)

document.querySelector("#date").innerHTML = "Word Selected: " + today.toLocaleDateString("en-US", options);
document.querySelector("#next_word").innerHTML = "New Word In: " + msToHM(nextDayMs);

//Select word based on the day, and update display for time settings
//days since epoch
if(debug) console.log("days: ", now, today.getTimezoneOffset()*60*1000);
let wordInd = Math.floor((now+today.getTimezoneOffset()*60*1000)/8.64e7) % WORDS_FR.length;
let targetWord = WORDS_FR[wordInd];
if(debug) console.log("word: ", targetWord, wordInd);

//adjust the canvas which displays the word selection elements
let canvas = document.getElementById("viewport");
let canvasCtx = canvas.getContext("2d");
canvas.width=1000;//horizontal resolution - increase for better looking text
canvas.height=800;//vertical resolution - increase for better looking text
canvas.style.height=500;//actual height of canvas

const Keyboard = window.SimpleKeyboard.default;

const myKeyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  layout: {
    'default': [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      '{enter} Z X C V B N M {bksp}'
    ]
  },
  display: {
    '{bksp}': '⌫',
    '{enter}': 'enter'
  },
});

/********************************************************************/
/************************Setup game elements*************************/
/********************************************************************/

drawBoard(targetWord, MAX_GUESSES, true, debug);

//keyboard events on change
//prevent overflowing input longer then the target word
function onChange(input) {
    if(myKeyboard.getInput().length > targetWord.length){
        myKeyboard.setInput(myKeyboard.getInput().slice(0,-1));   
    }
    else{
        document.querySelector("#input").innerHTML = input;
        if(debug) console.log("Input changed", input);
    }
}

//keyboard events on key press
//on enter - submit the guess, or reject if it's not long enough, or an invalid word
//otherwise - default keyboard behavior to add to input buffer
function onKeyPress(button) {
    if(button === "{enter}" && myKeyboard.getInput().length === targetWord.length){
        if(debug) console.log("guess count, ", currentGuess);
        if(currentGuess < MAX_GUESSES){
          if(WORDS_FR.includes(myKeyboard.getInput().toUpperCase())){
            document.querySelector("#warning").innerHTML = "";
            if(debug) console.log("send guess, ", myKeyboard.getInput());
            drawWord(myKeyboard.getInput(), currentGuess, targetWord, debug)
            currentGuess += 1;
            myKeyboard.setInput(""); 
          }
          else{
            if(debug) console.log("word is invalid");
            document.querySelector("#warning").innerHTML = "Word is invalid, try another.";
          }
        }
    }
    if(debug) console.log("Button pressed", button);
}

/********************************************************************/
/*********************game play/setup functions**********************/
/********************************************************************/

//draw grid lines on the canvas
//word_length = columns needed
//guesses = rows needed
//canvasCtx is script scoped
function drawBoard(target, guesses, addFirst, verbose = false) {

    let size = {
        rows: guesses,
        cols: target.length
    };
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.beginPath();
    let ht = canvas.height;
    let wd = canvas.width;
  
    let rowHt = Math.floor(ht / size.rows);
    let colWd = Math.floor(wd / size.cols);
  
    for (let x = rowHt; x < ht - rowHt + 1; x += rowHt) {
      canvasCtx.moveTo(0, x);
      canvasCtx.lineTo(wd, x);
      if (verbose) console.log("line: 0," + x + " to " + wd + "," + x);
    }
  
    for (let x = colWd; x < wd - colWd + 1; x += colWd) {
      canvasCtx.moveTo(x, 0);
      canvasCtx.lineTo(x, ht);
      if (verbose) console.log("line: " + x + ",0 to " + x + "," + ht);
    }
  
    canvasCtx.strokeStyle = "#000000";
    canvasCtx.lineWidth = 2;
    canvasCtx.stroke();

    if(addFirst){
      //write first letter to board
      const xStart = 0;
      const xOffset = colWd/2 - 50;
      const yStart = 0;
      const yOffset = rowHt/2 + 40; 
      canvasCtx.fillStyle = "#000";
      canvasCtx.font = "120px Georgia";
      canvasCtx.fillText(target.charAt(0).toUpperCase(), xStart + xOffset, yStart + yOffset);
    }
}

//draw a guess to the board
//highlight squares based on how it matches target
//dim keyboard keys no longer needed
//word = guess (str) being written in
//guessCount = (int) current guess (indicated row index to be written to)
//target = word (str) being compared against
function drawWord(word, guessCount, target, verbose = false){
  word = word.toUpperCase();
  target = target.toUpperCase();
  let ht = canvas.height;
  let wd = canvas.width;
  let rowHt = Math.floor(ht / MAX_GUESSES); //number of guesses = rows
  let colWd = Math.floor(wd / word.length); //length of word = cols

  if(guessCount === 0){
    drawBoard(target, MAX_GUESSES, false);
  }

  for(let i = 0; i < word.length; i++){
    let letter = word.charAt(i);
    if(verbose) console.log("Letter " + letter + " , guess: " + guessCount);

    //identify coordinates, then fill
    let xStartFill = colWd * i;
    let yStartFill = rowHt * guessCount;
    let adjust = [1, 1, -2, -2]; //2px grid lines
    if (guessCount === 0) {
      //first row - no top line offset, start pos up 1px, ht inc 1px
      adjust[1] = 0;
      adjust[3] = -1;
    }
    if (i === 0) {
      //first col - no left line, start pos left 1px, wd inc 1px
      adjust[0] = 0;
      adjust[2] = -1;
    }
    if (guessCount === MAX_GUESSES-1){
      //last row - inc row ht to fill edge
      const htRemainder = ht % rowHt;
      adjust[3] = htRemainder - 1;
    }
    if (i === target.length-1){
      //last column - inc col wd to fill edge
      const colRemainder = wd % colWd;
      adjust[2] = colRemainder - 1;
    }
    
    if(target.includes(letter)){
      //letter match - highlight orange
      canvasCtx.fillStyle = matchingLetter;
      if(verbose) console.log("Letter match " + letter);
      if(letter === target.charAt(i)){
        //exact match - highlight red
        canvasCtx.fillStyle = matchingSpace;
        if(verbose) console.log("Exact match " + letter);
      }
      canvasCtx.fillRect(
        xStartFill + adjust[0],
        yStartFill + adjust[1],
        colWd + adjust[2],
        rowHt + adjust[3]
      ); //adjustments for line thickness
    }
    else{
      myKeyboard.addButtonTheme(letter, "hg-dark")
    }

    if(verbose) console.log("write " + letter);
    //write letters to board
    const xStart = colWd * i;
    const xOffset = colWd/2 - 50;
    const yStart = rowHt * guessCount;
    const yOffset = rowHt/2 + 40; 
    canvasCtx.fillStyle = "#000";
    canvasCtx.font = "120px Georgia";
    canvasCtx.fillText(letter, xStart + xOffset, yStart + yOffset);
  }
}

//convert a millisecond value to a string made up of the hours and minutes in that time period
function msToHM( ms ) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;
  return hours+" Hours, "+minutes+" mins";
}