//sutom - 7-9 letters, common french word, 6 guesses 
//red = correct
//orange = letter is used, different space
//blue (default) = not used

/********************************************************************/
/**************************Setup variables***************************/
/********************************************************************/
let debug = false;
let maxGuesses = 6;
let currentGuess = 0;
let matchingSpace = "#FF0000";
let matchingLetter = "#FFA500";

//WORDS_FR from separate list file
let now = new Date();
//days since epoch
let wordInd = Math.floor(now/8.64e7) % WORDS_FR.length;
let targetWord = WORDS_FR[wordInd];
if(debug) console.log("word: ", targetWord);

//script variables that display and govern game state
let canvas = document.getElementById("viewport");
let canvasCtx = canvas.getContext("2d");
canvas.width=1000;//horizontal resolution (?) - increase for better looking text
canvas.height=800;//vertical resolution (?) - increase for better looking text
//canvas.style.width=400;//actual width of canvas
canvas.style.height=500;//actual height of canvas

drawBoard(targetWord.length, debug);

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

function onChange(input) {
    if(myKeyboard.getInput().length > targetWord.length){
        myKeyboard.setInput(myKeyboard.getInput().slice(0,-1));   
    }
    else{
        document.querySelector("#input").innerHTML = input;
        if(debug) console.log("Input changed", input);
    }
}

function onKeyPress(button) {
    if(button === "{enter}" && myKeyboard.getInput().length === targetWord.length){
        if(debug) console.log("guess count, ", currentGuess);
        if(currentGuess < maxGuesses){
          if(WORDS_FR.includes(myKeyboard.getInput().toLowerCase())){
            document.querySelector("#warning").innerHTML = "";
            if(debug) console.log("send guess, ", myKeyboard.getInput());
            drawWord(myKeyboard.getInput(), currentGuess, targetWord)
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
//return array of 0s for the size passed in
//canvasCtx is script scoped
function drawBoard(word_length, verbose = false) {
    let size = {
        rows: 6,
        cols: word_length
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
  
    let tempBoard = new Array();
    for (let i = 0; i < size.rows; i++) {
      let a = new Array(size.cols);
      for (let j = 0; j < size.cols; ++j) a[j] = 0;
      if (verbose) console.log(a);
      tempBoard.push(a);
    }
    if (verbose) console.log(tempBoard);
    return tempBoard;
}

//add comments
function drawWord(word, guessCount, target){
  word = word.toUpperCase();
  target = target.toUpperCase();
  let ht = canvas.height;
  let wd = canvas.width;
  let rowHt = Math.floor(ht / maxGuesses); //number of guesses = rows
  let colWd = Math.floor(wd / word.length); //length of word = cols
  for(let i = 0; i < word.length; i++){
    let letter = word.charAt(i);
    if(debug) console.log("Letter " + letter + " , guess: " + guessCount);

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
    if (guessCount === maxGuesses-1){
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
      if(debug) console.log("Letter match " + letter);
      if(letter === target.charAt(i)){
        //exact match - highlight red
        canvasCtx.fillStyle = matchingSpace;
        if(debug) console.log("Exact match " + letter);
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

    if(debug) console.log("write " + letter);
    //write letters to board
    const xStart = colWd * i;
    const xOffset = colWd/2 - 40;
    const yStart = rowHt * guessCount;
    const yOffset = rowHt/2 + 25; 
    canvasCtx.fillStyle = "#000";
    canvasCtx.font = "120px Georgia";
    canvasCtx.fillText(letter, xStart + xOffset, yStart + yOffset);
  }
}

