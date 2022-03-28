const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/95a4805b09"

  const options = {
    method: "POST",
    auth: "admin:8b2396eeb3d551ae3f2b3c0d3ec6dccc-us14"
  }

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data))
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/")
});

app.listen(process.env.PORT || port, () => {
  console.log("Port is 3000");
});


// 8b2396eeb3d551ae3f2b3c0d3ec6dccc-us14
//95a4805b09
