const express = require('express');
const fs = require('fs');
const path = require('path');
const generateUniqueId = require('generate-unique-id');

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static files
app.use(express.static('public'));

// get notes database
let rawdata = fs.readFileSync('db/db.json');
let notes = JSON.parse(rawdata);

// routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// return all notes as a JSON file
app.get('/api/notes', (req, res) => res.json(notes));

// add new notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // add unique id to new note
    const id = generateUniqueId({
        length: 10
       });
    newNote.id = id;
    
    notes.push(newNote);
    res.json(newNote);
  });

// delete requests
app.delete('/api/notes/:note', function (req, res) {
    const chosen = req.params.note;
    for (let i = 0; i < notes.length; i++) {
        if (chosen === notes[i].id) {
            notes.splice(i,1);
          return res.json(notes[i]);
        }
      }
  });

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));