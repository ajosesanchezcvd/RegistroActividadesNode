class Utils {
    constructor() {

    }

    CookieValue(request, name) {
        var Cookie = require('request-cookies').Cookie;
        var rawcookies = request.headers['set-cookie'];
        for (var i in rawcookies) {
            var cookie = new Cookie(rawcookies[i]);
            if (cookie.key = name) {
                return cookie.value;
            }
            return "";
        }
    }

    ReadSiteFile() {
        const fs = require('fs');
        return fs.readFileSync('site.json');
        fs.readFile('site.json', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            return data
        })
    }

    SiteSetting(name) {
        let s = this.ReadSiteFile();
        if (s == "") { s = "{}"; }
        let json = JSON.parse(s);
        if (json[name] != null) { return json[name] }
        return "";
    }

    IsUserLogged(req) {
        return (this.CookieValue(req, "B1SESSION") != null && this.CookieValue(req, "B1SESSION") != "")
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    replaceAllItems(str, find, replace) {
        var l = find.split("|");
        for (var i = 0; i < l.length; i++) {
            str = this.replaceAll(str,l[i],replace)
        }
        return str;
    }

    stringFormat() {
        var args = arguments,
        string = args[0],
        i = 1;
        return string.replace(/%((%)|s|d)/g, function (m) {
            // m is the matched format, e.g. %s, %d
            var val = null;
            if (m[2]) {
                val = m[2];
            } else {
                val = args[i];
                // A switch statement so that the formatter can be extended. Default is %s
                switch (m) {
                    case '%d':
                        val = parseFloat(val);
                        if (isNaN(val)) {
                            val = 0;
                        }
                        break;
                }
                i++;
            }
            return val;
        });
    }

    formatJsonError(error){
        return this.stringFormat('{ "errorMsg": "%s" }',error)
    }

    isError(error){
        if (error.startsWith("error:") > 0) {
            return true;
        }
        return false;
    }
}

module.exports = Utils
