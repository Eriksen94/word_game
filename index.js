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
  res.render("main");
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
