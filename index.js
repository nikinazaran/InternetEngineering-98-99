const express = require('express')
const whiskers = require('whiskers')
const fs = require('fs');
//var pig = require('point-in-geopolygon')
var bpip = require('@turf/boolean-point-in-polygon')
var tpoint = require('turf-point')
var tpolygon = require('turf-polygon')
var bodyParser = require('body-parser');

var NYcontents = fs.readFileSync('./NY.json');
var map = JSON.parse(NYcontents);

const app = express()
const port = 3000

// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());

console.log('--------------------------- NEW APP ')
app.use('/', (req, res, next) => {
    console.log('Middleware Called!')
    next();
});

app.get('/gis/testpoint', (req, res) => {
    console.log(req.query)

    locs = {
        "polygons": []
    };


    map.features.forEach(polygon => {
        if (bpip.default(tpoint([req.query.long, req.query.lat]), tpolygon(polygon.geometry.coordinates))) {
            locs.polygons.push(polygon.properties.name);
        }
    });

    res.send(locs);
});

app.put('/gis/addpolygon', express.json(), (req, res) => {
    map.features.push(req.body);
    fs.writeFileSync('./NY.json', JSON.stringify(map), 'utf8', (err) => {
        if (err) {
            console.log("not working!");
        }
    });
    res.send("Succesfully added to map.")
});


app.listen(process.env.PORT | port, () => console.log(`HW1 app listening on port ${port}!`))