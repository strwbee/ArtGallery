const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

let paintings = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "paintings.json"), "utf8"));
let comments = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "comments.json"), "utf8"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use('/images', express.static(path.join(__dirname, 'frontend', 'images')));

app.get('/', function(req, resp){
    resp.status(200).send('server is serving');
});

// GET METHOD FOR PAINTINGS

//get all paintings
app.get("/api/paintings", function(req, resp){
    const paintings = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "paintings.json"), "utf8"));
    resp.json(paintings);
});

//get painting by ID
app.get("/api/painting/:id", function(req,resp){
    const paintings = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "paintings.json"), "utf8"));
    const painting = paintings.find((p) => p.id === parseInt(req.params.id));
    
    if (painting) {
        resp.json(painting);
    }
    else {
        resp.status(404).send({error: "painting not found"});
    }
});

// GET METHOD FOR COMMENTS

//get all comments for a painting
app.get("/api/comments/:paintingId", function(req, resp){
    const paintingId = req.params.paintingId;
    if (!comments || typeof comments !== "object") {
        comments = {};
    }
    //return empty if no comments
    const paintingComments = comments[paintingId] || [];
    resp.json(paintingComments);
});

// POST METHOD FOR COMMENTS

//post a new comment
app.post("/api/comments/:paintingId", function(req, resp){
    let id = comments.length + 1;
    let paintingId = req.params.paintingId;
    let name = req.body.name;
    let text = req.body.text;

    if (!text) {
        return resp.status(400).json({error: "comment required"});
    }
    
    //add comments for painting if they dont exist
    if (!comments[paintingId]) {
        comments[paintingId] = [];
    }

    let newComment = {"name": name || "Anonymous", "text": text};
    comments[paintingId].push(newComment);

    try {
        let commentsText = JSON.stringify(comments);
        fs.writeFileSync(path.join(__dirname, "data", "comments.json"), commentsText);
        resp.status(200).json(newComment);
    } catch(error) {
        console.error("error saving comment:", error);
        resp.status(400).json({error: "error saving comment"})
    }
});


module.exports = app;