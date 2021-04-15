//import and configure express

let express = require("express");
let app = express();
app.set("view engine", "ejs"); //lets it know to look into the views folder
//enable form post Variables
app.use(express.urlencoded({ extended: true }));

//creates static directory for stylesheet
app.use("/styles", express.static(__dirname + "/styles"));

//create database action settings
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "$oyBoricuaprsjm2017",
    database: "MusicLibrary",
    port: 5432,
  },
});

//create a homepage
app.get("/", (req, res) => {
  knex
    .select()
    .from("Songs")
    .then((results) => {
      res.render("index", { aSongs: results });
    });
});

//add song form
app.get("/addsong", (req, res) => {
  res.render("addsong");
});

//add Song post route
app.post("/addsong", (req, res) => {
  let sSongName = req.body.SongName;
  let sArtistID = req.body.ArtistID;
  let iYear = req.body.YearReleased;
  console.log(req);
  knex("Songs")
    .insert({
      SongName: sSongName,
      ArtistID: sArtistID,
      YearReleased: iYear,
    })
    .then((result) => {
      res.redirect("/");
    });
});

//edit songs fourm

app.get("/edit/:SongID", (req, res) => {
  console.log("you sent " + req.params.SongID);
  knex
    .select()
    .from("Songs")
    .where("SongID", req.params.SongID)
    .then((results) => {
      res.render("editsong", { aSongs: results });
    });
});

//edit song post
app.post("/edit/:SongID", (req, res) => {
  let sSongName = req.body.SongName;
  let sArtistID = req.body.ArtistID;
  let iYear = req.body.YearReleased;
  knex("Songs")
    .where("SongID", req.params.SongID)
    .update({
      SongName: sSongName,
      ArtistID: sArtistID,
      YearReleased: iYear,
    })
    .then((result) => {
      res.redirect("/");
    });
});

//delete song route
app.get("/delete/:SongID", (req, res) => {
  knex("Songs")
    .where("SongID", req.params.SongID)
    .del()
    .then((result) => {
      res.redirect("/index").catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
    });
});

//reset route
app.get("/reset", (req, res) => {
  knex("Songs")
    .del()
    .then((result) => {
      res.redirect("/reset2");
    });
});
//adding the three songs back into the list
app.get("/reset2", (req, res) => {
  knex("Songs")
    .insert([
      {
        SongName: "BOHEMIAN RHAPSODY",
        ArtistID: "QUEEN",
        YearReleased: 1975,
      },
      {
        SongName: "Don't Stop Believing",
        ArtistID: "JOURNEY",
        YearReleased: 1981,
      },
      {
        SongName: "Hey Jude",
        ArtistID: "BEATLES",
        YearReleased: 1968,
      },
    ])
    .then((result) => {
      res.redirect("/");
    });
});

//my display songs page
app.get("/index", (req, res) => {
  knex
    .select()
    .from("Songs")
    .then((results) => {
      res.render("index", { aSongs: results });
    });
});

app.listen(3000);
