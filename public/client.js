/********************************************************************/
/**************************Setup variables***************************/
/********************************************************************/
let debug = true;
let maxGuesses = 6;
let currentGuess = 0;
let targetWord = "tester"; //replace with API later

//script variables that display and govern game state
let canvas = document.getElementById("viewport");
let canvasCtx = canvas.getContext("2d");
canvas.width=1000;//horizontal resolution (?) - increase for better looking text
canvas.height=500;//vertical resolution (?) - increase for better looking text
canvas.style.width=400;//actual width of canvas
//canvas.style.height=500;//actual height of canvas

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
  }
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
            if(debug) console.log("send guess, ", myKeyboard.getInput());
            drawWord(myKeyboard.getInput(), currentGuess)
            currentGuess += 1;
        }
    }
    if(debug) console.log("Button pressed", button);
}

//sutom - 7-9 letters, common french word, 6 guesses 
//red = correct
//orange = letter is used, different space
//blue (default) = not used

/********************************************************************/
/*********************game play/setup functions**********************/
/********************************************************************/

//draw grid lines on the canvas
//return array of 0s for the size passed in
//params: size {rows: ..., cols: ...}
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

function drawWord(word, guessCount){

}

