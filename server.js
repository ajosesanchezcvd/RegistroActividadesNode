var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')

app.use(bodyParser.text({ type: "*/*" }));
app.use(cookieParser());
app.set('case sensitive routing', false);

/* 
const Sbo = require('./sbo.js')
var sbo = new Sbo();
sbo.user = "jpstifel";
sbo.password = "zzXX1122";
sbo.company = "VK_DEMO";
sbo.login(function (result) {
    sbo.getBussinesPartner("34501615-5C", function (result) {
        sbo.logout(function () {
        })
    })
});
 */
var route = require("./route.js")
app.use("/", route);

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});