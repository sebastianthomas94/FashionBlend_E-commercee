const exp = require('express');
const router = exp.Router();
const accountSid = "AC7cbfea2db39cce3c86dffe8a48d7e92a";
const authToken = "bed1b6a7253849d3e2195b982e4b0726";
const client = require("twilio")(accountSid, authToken);


router.post("/",  (req, res) =>{
    req.session.OTP= Math.floor(Math.random()*8999+1000);console.log("OTP from /:",req.session);
    const phoneNumber= "+91"+req.body.phoneNumber;

/*     client.messages.create({
        body: `Your otp verification for the user _______ is ${req.session.OTP}`,
        to : "whatsapp:"+phoneNumber,
        from : "whatsapp:+14155238886"

    })
    .then((message) => console.log(message))
    .catch((err)=> console.log(err));  */
    res.end();
});

router.post("/verify", (req, res)=>{
    console.log("OTP from /verify:",req.session);
    if(req.session.OTP==req.body.OTP)
    {
        console.log("verified");
        res.redirect("/");
    }
    else
        console.log("wrong otp");
    
});


module.exports = router;