//Game logic and word lists are client side, the server simply renders the main (and only) page

/********************************************************************/
/****************module imports and setup****************************/
/********************************************************************/
const express = require("express");
const ejs = require("ejs");
const app = express();

const http = require("http").Server(app);
app.set('view engine', 'ejs');
app.use(express.static("public"));

let gamePort = process.env.PORT || 3000;

/********************************************************************/
/**************************get routes********************************/
/********************************************************************/
//root route to main page
app.get("/", function (req, res) {
  let today = new Date();
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let nextDayMs = 8.64e7 - (today - 8.64e7 * Math.floor(today/8.64e7));

  let renderContent = {
    day: today.toLocaleDateString("en-US", options),
    nextWord: msToHM(nextDayMs)
  }
  res.render("main", renderContent);
});

/********************************************************************/
/**************************Open Server*******************************/
/********************************************************************/

const server = http.listen(gamePort, () => {
    console.log("server is running on port: ", server.address().port);
});

/********************************************************************/
/**************************Convenience*******************************/
/********************************************************************/

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
