require("dotenv").config();
const {google} = require('googleapis');
const express = require("express");
const fs = require('fs');
const url = require("url");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth'
);
const scopes = ['https://www.googleapis.com/auth/drive'];
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});
console.log('Authorize this app by visiting this url:', authUrl);

const port = process.env.port || 3000;

const app = express();

app.get("/oauth", (req, res) => {
    let rUrl = req.url;
    let code = url.parse(rUrl, true).query.code;

    res.end("Authenticated")

    oAuth2Client.getToken(code , (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      //write the token to a file
      fs.writeFileSync('token.pickle', JSON.stringify(token));
      console.log('Token stored in token.pickle');
    });
})

app.listen(port)