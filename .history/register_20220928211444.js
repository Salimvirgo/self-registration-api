// require("dotenv").config();
const express = require("express");
const app = express();
const helper = require("./");
const bodyParser = require("body-parser");
//require("body-parser-xml")(bodyParser);
const { default: axios } = require("axios");
const { XMLBuilder, XMLParser } = require("fast-xml-parser");
const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();
var http = require("http");
const moment = require("moment");
const { Console } = require("console");
const { buildXMLFromJSON } = require("./helper/helpers");

//parsing xml
// app.use(
//   bodyParser.xml({
//     limit: "1MB", // Reject payload bigger than 1 MB
//     xmlParseOptions: {
//       normalize: true, // Trim whitespace inside text nodes
//       normalizeTags: true, // Transform tags to lowercase
//       explicitArray: false, // Only put nodes in array if >1
//     },
//   })
// );
//disabling e-tag
app.disable("x-powered-by");
app.set("etag", false); // turn off

let iPacsResponseData = {};
//API entry point
app.get("/self-register/:phone", async (req, res) => {
  try {
    
  } catch (error) {
    
  }
});

//USSD option 1 call
app.get("/tango-stream?:response", (req, res) => {
  try {
    const { response } = req.query;

    if (typeof response === "undefined" || !response) {
      return res.sendStatus(401);
    }

    if (response === "Confirm") {
      console.log(iPacsResponseData);
      if (Object.keys(iPacsResponseData).length) {
        const format = buildXMLFromJSON(iPacsResponseData);

        console.log(format)
        res.send("Registration Successful");
      } else {
        res.sendStatus(401);
      }
    }

    if (response === "Reject") {
      //todo redirect to normal orange money flow
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  return;
});

//USSD option 2 call
app.get("/tangostream2", (req, res) => {
  const rejectcontent = "You'll be redirected to another flow";
  const rejectwrapper =
    "<?xml version='1.0' encoding='UTF-8'?>\r\n" +
    "<!DOCTYPE pages SYSTEM 'cellflash.dtd'>\r\n" +
    "<pages descr='' >\r\n" +
    "<page  descr='Orange Money' hist='dohist' nav='default' ismenu='true' volatile='false'>\r\n" +
    rejectcontent +
    "</page>\r\n" +
    "</pages>";
  res.header({ "Content-Type": "text/xml", Accept: "text/xml" });
  res.send(rejectwrapper);
});

//Server Middleware
const PORT = process.env.PORT || 8060;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error: running this server");
  } else {
    console.log("This application is alive on http://TestServer:${PORT}");
  }
});
//ous data u want pa the response??

//yes
//okay
