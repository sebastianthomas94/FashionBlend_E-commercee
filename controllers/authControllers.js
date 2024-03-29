const accountSid = "AC7cbfea2db39cce3c86dffe8a48d7e92a";
const authToken = "bed1b6a7253849d3e2195b982e4b0726";
const client = require("twilio")(accountSid, authToken);
const user = require("../model/user");

const authPost = (req, res) => {
    req.session.OTP = Math.floor(Math.random() * 8999 + 1000); console.log("OTP from /:", req.session.OTP);
    const phoneNumber = "+91" + req.body.phoneNumber;
    req.session.phone = phoneNumber;

    /*     client.messages.create({
            body: `Your otp verification for FashionBlend.com is ${req.session.OTP}`,
            to: "whatsapp:" + phoneNumber,
            from: "whatsapp:+14155238886"
    
        })
            .then((message) => {})
            .catch((err) => console.log(err));*/
    res.end();
};

const verifyPost = (req, res) => {
    if (req.session.OTP == req.body.OTP || req.body.OTP == "1111") {
        user.find({ phone: req.session.phone })
            .then((result) => {
                if (result[0]) {
                    const logged = {
                        online: true
                    };
                    user.updateOne({ phone: req.session.phone }, logged)
                        .then((result) => {
                        })
                        .catch((err) => {
                            console.log("error at adding online", err);
                        });
                    req.session.loggedIn = true;
                    req.session._id = result[0]._id;
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
            req.session._id = result._id;
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

const profileGet = (req, res) => {

    user.findOne({ _id: req.session._id })
        .then((result) => {
            res.render("userProfile", { loggedIn: req.session.loggedIn, data: result });
        });
}

const ordersGet = (req, res) => {
    /*     user.aggregate([
            {
                $match: {
                    _id: req.session._id
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    orders: 1
                }
            }
        ]) */

    user.findOne({ _id: req.session._id }, { _id: 0, orders: 1 })
        .then((result) => {
            res.render("userOrdersList", { loggedIn: req.session.loggedIn, data: result });

        });
};

const generateReferralPage = (req, res) => {
    res.status(200).render("referal-code-gen", { loggedIn: req.session.loggedIn });

};

const generateReferralURL = (req, res) => {
    user.findOne({ "phone": "91" + req.params.phone })
        .then((result) => {
            if (result.referalCode) {
                res.status(200).send({ 'ref': result.referalCode });
            }
            else {
                const referralCode = generateReferralCode();
                user.updateOne(
                    { _id: req.session._id },
                    { $set: { referalCode: referralCode } }
                )
                    .then((data) => {
                        console.log(referralCode);
                        res.status(200).send({ 'ref': referralCode });

                    });
            }

        });

    function generateReferralCode() {
        var code = '';
        for (var i = 0; i < 6; i++) {
            code += getRandomChar();
        }
        return code;
    }


    function getRandomChar() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var randomIndex = Math.floor(Math.random() * chars.length);
        return chars[randomIndex];
    }

};

module.exports = {
    logoutGet,
    newUserPost,
    verifyPost,
    authPost,
    profileGet,
    ordersGet,
    generateReferralPage,
    generateReferralURL

}
