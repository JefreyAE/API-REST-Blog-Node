const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("Starting...");

//Connect to the database
connection();

//Node server
const app = express();
const port = 3900;
app.use(cors()); //Config CORS

//Transform body to JS object
// app.use(express.json()); // For content-type: app/json
app.use(express.urlencoded({extended: true}));


//Routes
const articles_routes = require("./routes/article_routes");
app.use("/api", articles_routes);

//Create the server and listen requests
app.listen(port, () => {
    console.log("Server listening the port " + port);
});

