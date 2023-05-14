const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const GoogleStrategy = require("passport-google-oauth");
const { passport } = require("./google.outh");


app.use(cookieParser());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})
app.get("/a", (req, res) => {
  res.sendFile(__dirname + "/login.html");
})


/* *********************************github Oauth********************** */
// app.get("/auth/github",async (req,res)=>{
//     let {code}=req.query;
//     let response = await fetch("https://github.com/login/oauth/access_token",{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json",
//             Accept:"application/json"
//         },
//         body:JSON.stringify({client_id:clientID,client_secret:clientSecret,code:code})
//     }).then((res)=>{return res.json()});

//     let data = await fetch("https://api.github.com/user",{
//         headers:{
//             "Content-Type":"application/json",
//             Accept:"application/json",
//             Authorization: `Bearer ${response.access_token}`
//         }
//     }).then((res)=>{return res.json()});

//     console.log(data);
//     let temp = JSON.parse(fs.readFileSync("data.json","utf-8")); 
//      let obj={};
//      obj["name"]=data.name;
//      obj.image=data.avatar_url;
//      temp.push(obj);
//      fs.writeFileSync("data.json",JSON.stringify(temp));
//     res.cookie("token",response.access_token,{httpOnly:true});
//     res.cookie("token",response.access_token);
//     res.send("Login Succesful");

// })

/* ********************************************************************** */

// let clientID="6281083b12f96885a0e7";
// let clientSecret="487abf236c81c11f41c972d31661a74035836250";
// let google_clientID="529584347391-jtut0k55809gr8nq723ipu3g9kfpm3qn.apps.googleusercontent.com";
// let google_clientSECRET="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";

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function (req, res) {
    // console.log(req.body);
    // Successful authentication, redirect home.
    res.redirect('/a');
  });






app.listen(3500, (req, res) => {
  console.log("Server running at http://localhost:3500");
})