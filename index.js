const express = require("express");
const jsforce = require("jsforce");
const app = express();
require("dotenv").config();
const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL
});

conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
  if (err) {
    console.error(err);
  } else {
    console.log("User Id", userInfo);
    console.log("Org Id", userInfo.organizationId);
  }
});
app.get("/", function (req, res) {
    res.send("<a href='/find'>find</a><br/><a href='/account'>account</a>")
});
app.get("/find", function (req, res) {
  conn.search(
    'Find {"Random"} IN ALL FIELDS RETURNING Account',
    (err, result) => {
      if (err) {
        console.log(err);
      }

      console.log("Total Records", result);
      res.json(result.searchRecords);
    }
  );
});

app.get("/account", function (req, res) {
  
  conn.query(
    'Select Id, Name from Account',
    (err, result) => {
      if (err) {
        console.log(err);
      }

      console.log("Total Records", result);
      res.json(result.records);
    }
  );
});

app.listen(8089, () => {
  console.info(`Server running at 8089`);
});
