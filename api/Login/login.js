module.exports = function () {

    var mongoDB = require('../../config/mongo-connect.js');

    global.app.post('/login', function (req, res) {
        console.log(req.body, "body")
        var item = {
            userid: req.body.email,
            pwd: req.body.password
        };
        return res.json({ status: "Login Successful!!" });
    });
};
