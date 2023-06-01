const accountSid = "AC7cbfea2db39cce3c86dffe8a48d7e92a";
const authToken = "bed1b6a7253849d3e2195b982e4b0726";
const client = require("twilio")(accountSid, authToken);
const user = require("../model/user");

const authPost = (req, res) => {
    req.session.OTP = Math.floor(Math.random() * 8999 + 1000); console.log("OTP from /:", req.session.OTP);
    const phoneNumber = "+91" + req.body.phoneNumber;
    req.session.phone = phoneNumber;

    client.messages.create({
        body: `Your otp verification for FashionBlend.com is ${req.session.OTP}`,
        to: "whatsapp:" + phoneNumber,
        from: "whatsapp:+14155238886"

    })
        .then((message) => console.log(message))
        .catch((err) => console.log(err));
    res.end();
};

const verifyPost = (req, res) => {
    if (req.session.OTP == req.body.OTP) {
        user.find({ phone: req.session.phone })
            .then((result) => {
                if (result[0]) {
                    const logged = {
                        online: true
                    };
                    user.updateOne({ phone: req.session.phone }, logged)
                        .then((result) => {
                            console.log("online added sucsessfuly", result);
                        })
                        .catch((err) => {
                            console.log("error at adding online", err);
                        });
                    req.session.loggedIn = true;
                    res.redirect("/");
                }
                else {
                    res.render("signup", { loggedIn: req.session.loggedIn });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    else {
        res.send("wrong otp");
    }
};

const newUserPost = (req, res) => {
    const newUser = new user({
        email: req.body.email,
        name: req.body.firstname + " " + req.body.lastname,
        phone: req.session.phone,
        gender: req.body.gender,
        online: true
    });
    newUser.save()
        .then((result) => {
            req.session.loggedIn = true;
            res.redirect("/");
        })
        .catch((err) => { console.log(err); })
};

const logoutGet = (req, res) => {

    const logged = {
        online: false
    };
    user.updateOne({ phone: req.session.phone }, logged)
        .then((result) => {
            console.log("online added sucsessfuly", result);
        })
        .catch((err) => {
            console.log("error at adding online", err);
        });
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
};

module.exports = {
    logoutGet,
    newUserPost,
    verifyPost,
    authPost

}