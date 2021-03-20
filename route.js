var express = require('express')
var router = express.Router()
var cookieParser = require('cookie-parser')

router.use(cookieParser());

const Sbo = require('./sbo.js')
const Utils = require('./utils.js')
const Path = require('path');

let sbo = new Sbo();
let utils = new Utils();

router.use(function checkPage(req, res, next) {
    let doRedirect = utils.SiteSetting("checkLogin");
    if (doRedirect) {
        let path = req.path.toLowerCase();
        doRedirect = !((path.indexOf("login") > 0) || (path.indexOf("index") > 0) || path.endsWith(".ico"));
        doRedirect = (doRedirect && ((typeof req.cookies.B1SESSION == "undefined") || (req.cookies.B1SESSION == null) || (req.cookies.B1SESSION == "undefined") || (req.cookies.B1SESSION == "")));
    }
    if (doRedirect) {
        res.sendFile(Path.join(__dirname + '/Login.html'));
    }
    else {
        console.log('Time: ', Date.now())
        next()
    }
})

router.get('/Login.html', (req, res) => {
    res.sendFile(Path.join(__dirname + '/Login.html'));
    //res.redirect("/Login.html");
});

router.get('/Home.html', (req, res) => {
    res.sendFile(Path.join(__dirname + '/Home.html'));
});

router.get('/NewActivity.html', (req, res) => {
    res.sendFile(Path.join(__dirname + '/NewActivity.html'));
});

router.post('/login', (req, res) => {
    var result = "";
    let options = {
        maxAge: 1000 * 60 * 30, // would expire after 30 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }
    var json = JSON.parse(req.body);
    sbo.user = json.user;
    sbo.password = json.password;
    sbo.company = json.company;
    result = sbo.login(function (result) {
        if (!utils.isError(result)) {
            res.cookie("B1SESSION", sbo.B1SESSION, options);
            res.cookie("ROUTEID", sbo.ROUTEID, options);
        }
        res.send(result);
    });
});

router.get('/logout', (req, res) => {
    var result = "";
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    result = sbo.logout(function (result) {
        if (utils.isError(error)) {
            result.send(result)
        }
        else { res.redirect("/Login.html"); }

    });

});

router.post('/GetBusinessPartner', (req, res) => {
    var result = "";
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    result = sbo.GetBusinessPartner(body, function (result) {
        res.send(result);
    });
});

<<<<<<< HEAD

router.post('/AddActivity', (req, res) => {
=======
router.post('/GetActivitySubjects', (req, res) => {
    var result = "";
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    result = sbo.GetActivitySubjects(body, function (result) {
        res.send(result);
    });
});

router.post('/GetBusinessPartners', (req, res) => {
>>>>>>> tmp
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    sbo.addActivity(body, function (result) {
        res.send(result);
    });
});

router.post('/GetBusinessPartnersB1i', (req, res) => {
    //console.log(req);
    var result = "";
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    console.log("Route: " +  body)
    result = sbo.GetBusinessPartnerB1i(body, function (result) {
        res.send(result);
    });
});





router.post('/GetBusinessPartners', (req, res) => {
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    sbo.GetBusinessPartners(body, function (result) {
        res.send(result);
    });
});

router.post('/GetBusinessPartnerContactEmployes', (req, res) => {
    sbo.B1SESSION = req.cookies.B1SESSION;
    sbo.ROUTEID = req.cookies.ROUTEID;
    let body = req.body;
    sbo.GetBusinessPartnerContactEmployes(body, function (result) {
        res.send(result);
    });
});



module.exports = router