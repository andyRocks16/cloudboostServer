module.exports = function () {

    var mongoDB = require('../../config/mongo-connect.js');

    global.app.post('/notifyMaster', function (req, res) {
        console.log(req.body, "body");
        var item = {
            appid : req.boy.appid,
            userData : {
                userid: req.body.email,
                pwd: req.body.password
            }
        };

        try {
            mongoDB.connectDB();
        } catch (err) {
            console.log(err);
        }
        return res.json({ status: "Login Successful!!" });
    });
};
