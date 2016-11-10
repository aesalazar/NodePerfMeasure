var express = require('express');
var router = express.Router();
var fs = require('fs');
var electronBuilder = require('./electronBuilder');

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Install page for Electron Application
router.get('/electron', function(req, res, next){
    const promise = electronBuilder
        .buildPromise()
        .then(() => {
            console.error("BUILT!");
            const data = fs.readFileSync(electronBuilder.outputPath);
            //res.setHeader('Content-type', 'application/exe, application/octet-stream');
            //res.send(data);
        }).catch((error) => {
            console.error(error);
        });
});

//Generate app.json dynamically based on calling ip
router.get('/app.json', function(req, res, next) {
    fs.readFile('./public/app.template.json', 'utf8', function(err, data) {
        //Set the json to reference ipaddress and send it back
        let json = data;
        json = json.replace(/<<URL_AND_PORT>>/gi, req.headers.host);
        res.setHeader('Content-type', 'application/json');
        res.send(json);
    });
});

module.exports = router;