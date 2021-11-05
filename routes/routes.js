const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Setup notes variable
    

        // API ROUTES
        // ========================================================
    
        // Setup the /api/notes get route
        app.get("/api/notes", function(req, res) {
            var notes;
            fs.readFile("db/db.json","utf8", (err, data) => {

                if (err) throw err;
        
                notes = JSON.parse(data);
                // Read the db.json file and return all saved notes as JSON.
                res.json(notes);

            })
        });

        // Setup the /api/notes post route
        app.post("/api/notes", function(req, res) {
            // Receives a new note, adds it to db.json, then returns the new note
            var notes;
            fs.readFile("db/db.json","utf8", (err, data) => {

                if (err) throw err;
        
                notes = JSON.parse(data);
                let newNote = req.body;
                newNote.id = Math.floor(Math.random() * 9999)

                notes.push(newNote);
                updateDb(notes);
                console.log("Added new note: "+newNote.title);
                res.json(notes);
            })

        });

        // Retrieves a note with specific id
        app.get("/api/notes/:id", function(req,res) {
            // display json for the notes array indices of the provided id
            var notes;
            fs.readFile("db/db.json","utf8", (err, data) => {

                if (err) throw err;
        
                notes = JSON.parse(data);
                res.json(notes[req.params.id]); 
            })
            
        });

        // Deletes a note with specific id
        app.delete("/api/notes/:id", function(req, res) {
            var notes;
            fs.readFile("db/db.json","utf8", (err, data) => {

                if (err) throw err;
        
                notes = JSON.parse(data);
                for(var i=0; i < notes.length; i++){
                    console.log (req.params.id)
                    if(notes[i].id === Number(req.params.id)){
                        notes.splice(i,1)
                    }
                }
                
            updateDb(notes);
            console.log("Deleted note with id "+req.params.id);
            res.json(notes)
            })

            
        });

        // VIEW ROUTES
        // ========================================================

        // Display notes.html when /notes is accessed
        app.get('/notes', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });
        
        // Display index.html when all other routes are accessed
        app.get('*', function(req,res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        //updates the json file whenever a note is added or deleted
        function updateDb(notes) {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }
}