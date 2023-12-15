const express = require("express");
const fs = require("fs");
const path = require('path');
const app = express();
const port = 8080;
app.use( function ( req, res, next ) {
 const { url, path: routePath } = req ;
 console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
 next();
});
app.use('/', express.static(path.join(__dirname, '')))


app.post('/api/v1/addUser', function (req, res) {
    const { query } = req;
    const newUser = {
        id: parseInt(query.user),
        name: query.name,
        password: query.password,
        profession: query.profession
    };

    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        let users = JSON.parse(data);
        users.push(newUser);

        fs.writeFile(__dirname + "/data/" + "users.json", JSON.stringify(users, null, 2), 'utf8', function (err) {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
                return;
            }

            res.status(200).json(users);
        });
    });
});

app.get('/api/v1/filterUsers/:userId', function (req, res) {
    const { userId } = req.params;

    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        let users = JSON.parse(data);
        const filteredUser = users.find(user => user.id === parseInt(userId));

        if (filteredUser) {
            res.status(200).json([filteredUser]);
        } else {
            res.status(404).send("User not found");
        }
    });
});


app.use(express.static(path.join(__dirname, '')))

app.listen(port, () => {
 console.log(`Server running on port ${port}...`)
}); 

/**
 * app.get('/api/v1/listUsers', function(req, res) {
    fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function(err, data){
    console.log (data);
    res.end(data);
    });
   }); 

   


 */
