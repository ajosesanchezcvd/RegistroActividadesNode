require('tls').DEFAULT_MIN_VERSION = 'TLSv1'

var Utils = require('./utils.js')

class Sbo {
    constructor() {
        this.utils = new Utils();
    }

    set company(value) {
        this._company = value;
    }
    get company() {
        return this._company;
    }
    set user(value) {
        this._user = value;
    }
    get user() {
        return this._user;
    }
    set password(value) {
        this._password = value;
    }
    get password() {
        return this._password;
    }
    set B1SESSION(value) {
        this._B1SESSION = value;
    }
    get B1SESSION() {
        return this._B1SESSION;
    }
    set ROUTEID(value) {
        this._ROUTEID = value;
    }
    get ROUTEID() {
        return this._ROUTEID;
    }

    get geturl() {
        return this.utils.SiteSetting("host") + "/" + this.utils.SiteSetting("baseurl") + "/";
    }

  /*  get geturlBi1(){
        return (this.utils.SiteSetting("urlB1i"));
    }*/

    setRequestCookies(req) {
        let options = {
            maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            signed: false // Indicates if the cookie should be signed
        }
        req.cookie("B1SESSION", this.B1SESSION, options);
        req.cookie("ROUTEID", this.ROUTEID, options);
        //req.Headers["Cookie"] = this.utils.stringFormat("B1SESSION={%s},ROUTEID={%s}",this.B1SESSION,this.ROUTEID);
    }

    setSessionVarsFromCookie(value) {
        var json = JSON.parse("{}");
        var l = this.utils.replaceAllItems(value, "HttpOnly;,| ", "");
        l = l.split(";");
        for (var i = 0; i < l.length; i++) {
            var cookie = l[i].split("=");
            if (cookie.length = 2) {
                if (cookie[0] == "B1SESSION") {
                    this.B1SESSION = cookie[1];
                }
                else if (cookie[0] == "CompanyDB") {
                    this.company = cookie[1];
                }
                else if (cookie[0] == "ROUTEID") {
                    this.ROUTEID = cookie[1];
                }
            }
        }
    }

    GetError(error, body) {
        var result = "";
        if (error) { result = "error: " + error; }
        else {
            var json = JSON.parse((body == null ? "{}" : body));
            if (json.error) { result = this.utils.stringFormat("error: %s", json.error.message.value); }
        }
        return result;
    }

    login(callback) {
        //var result = "B1SESSION=3;HttpOnly;, CompanyDB=VK_DEMO;HttpOnly;, ROUTEID=.node0; path=/b1s";
        //this.setSessionVarsFromCookie(result);
        //callback(result);
        //return
        var req = require("request");
        let json = { "UserName": this.user, "Password": this.password, "CompanyDB": this.company };
        let body = JSON.stringify(json);
        let url = this.geturl + "Login"
        req.post({
            "rejectUnauthorized": false,
            "headers": { "content-type": "application/json" },
            "url": url,
            "body": body
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = response.headers["set-cookie"].toString()
                this.setSessionVarsFromCookie(result);
            }
            callback(result);

        });
    }

    logout(callback) {
        var req = require("request");
        this.setRequestCookies(req);
        var json = {};
        var url = this.geturl + "Logout";
        req.post({
            "rejectUnauthorized": false,
            "headers": { "content-type": "application/json" },
            "url": url,
            "body": JSON.stringify(json)
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });

    }

    GetBusinessPartner(CardCode, callback) {
        var req = require("request");
        let url = this.geturl + this.utils.stringFormat("BusinessPartners('%s')?$select=CardName,CardType", CardCode);
        req.get({
            "rejectUnauthorized": false,
            "url": url,
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            }
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });
    }

    GetBusinessPartners(filter, callback) {
        var req = require("request");
        let command = "BusinessPartners?$select=CardCode,CardName&$top=10";
        if ((filter != null) && (filter != "")) {
            filter = this.utils.stringFormat("startswith(CardCode, '%s') or startswith(CardName, '%s')", filter, filter);
            command = command + "&$filter=" + filter;
        }
        let url = this.geturl + command;
        req.get({
            "rejectUnauthorized": false,
            "url": url,
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            }
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });
    }


/*
    GetBusinessPartnerB1i(json, callback) {
        var req = require("request");
        let url = this.geturlBi1;
        req.post({
           // "rejectUnauthorized": false,
            "headers": { "content-type": "application/json" },
            "url": this.geturlBi1,
            /*headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            },*/
    /*        "body":  '{  "command": " SELECT \"CardCode\", \"CardName\"   FROM \"VISUALK_CL\".\"OCRD\"  WHERE LOWER(\"CardCode\") LIKE LOWER(%Visual%)" }'
        });
    }
    */
    
    GetActivitySubjects(code, callback){
        var req = require("request");
        //let url = this.geturl + "ActivitySubjects?$select=Code,Description&$filter=ActivityType ge 8 ";;
        //console.log("codigo:" + code);
       let url = this.geturl + "ActivitySubjects?$select=Code,Description&$filter=ActivityType ge " + code;
      
        req.get({
            "rejectUnauthorized": false,
            "url": url,
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            }

        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });
    }

    GetSboSubAreas(code, callback){
        var req = require("request");
       let url = this.geturl + "SBO Areas('"+code+"')"; 
       //console.log("URL:" + url);
        req.get({
            "rejectUnauthorized": false,
            "url": url,
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            }

        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });
    }





    GetBusinessPartnerContactEmployes(CardCode, callback) {
        var req = require("request");
        let url = this.geturl + this.utils.stringFormat("BusinessPartners('%s')/ContactEmployees", CardCode);
        req.get({
            "rejectUnauthorized": false,
            "url": url,
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            }
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });
    }

    addActivity(json, callback) {
        var req = require("request");
        req.post({
            "rejectUnauthorized": false,
            "headers": { "content-type": "application/json" },
            "url": this.geturl + "Activities",
            headers: {
                'Cookie': this.utils.stringFormat("B1SESSION=%s,ROUTEID=%s", this.B1SESSION, this.ROUTEID)
            },
            "body": json
        }, (error, response, body) => {
            var result = this.GetError(error, body);
            if (!this.utils.isError(result)) {
                result = body
            }
            callback(result);
        });

    }
}

module.exports = Sbo
