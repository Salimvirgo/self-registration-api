// require("dotenv").config();
const express = require("express");
const app = express();
const helper = require("")
const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const { default: axios } = require("axios");
const { XMLBuilder, XMLParser } = require("fast-xml-parser");
const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();
var http = require("http");
const moment = require("moment");
const { Console } = require("console");

app.use(
  bodyParser.xml({
    limit: "1MB", // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false, // Only put nodes in array if >1
    },
  })
);

app.disable("x-powered-by");
app.set("etag", false); // turn off

app.get("/self-register/:phone", (req, res) => {
  const { phone } = req.params;
  // set url as constant
  const URL = `http://172.25.172.31:8086/get/Party?publicKey=${phone}&productStatus=ACTIVE`;
  var Regdata = [];
  var config = {
    headers: { "Content-Type": "text/xml" },
  };
  axios
    .get(URL, config)
    .then((response) => {
      Regdata = response.data;
      const rename_keys = (keysMap, Regdata) =>
        Object.keys(Regdata).reduce(
          (acc, key) => ({
            ...acc,
            ...{ [keysMap[key] || key]: Regdata[key] },
          }),
          {}
        );
      result = rename_keys(
        {
          id: "ID",
          gender: "GENDER",
          birthDate: "DOB",
          givenName: "FNAME",
          familyName: "LNAME",
        },
        Regdata
      );
      const name = result.FNAME;
      const lname = result.LNAME;
      const nationality = result.nationality;
      const idnumber = result.individualIdentification[2].identificationId;
      const gender = result.GENDER;
      function setGender() {
        if (gender === "M") {
          return "Male";
        } else {
          return "Female";
        }
      }
      let ngender = setGender(gender);
      const dob = result.DOB;
      let ndob = new Date(dob);
      function appendLeadingZeroes(n) {
        if (n <= 9) {
          return "0" + n;
        }
        return n;
      }
      let newdob =
        ndob.getDate() +
        "" +
        appendLeadingZeroes(ndob.getMonth() + 1) +
        "" +
        ndob.getFullYear();
      const USSDresponse = `${name} ${lname}  ${dob} ${idnumber}`;
      const options = {
        processEntities: true,
        ignoreAttributes: false,
        format: true,
      };
      const builder = new XMLBuilder(USSDresponse);
      const json = builder.build(result);
      //const format = '<?xml version="1.0"?>' +
      //const content = "Hello World " <br/>\r\n" +";
      const content1 =
        "Please read and confirm Registration details: <br/>" +
        USSDresponse +
        "<br/>";

      const USSDwrapper =
        "<?xml version='1.0' encoding='UTF-8'?>\r\n" +
        "<!DOCTYPE pages SYSTEM 'cellflash.dtd'>\r\n" +
        "<pages descr='' >\r\n" +
        "<page  descr='Orange Money' hist='dohist' nav='default' ismenu='true' volatile='false'>\r\n" +
        content1 +
        `<a href='/tangostream/'>Confirm </a><br/> 
                        <a href='/tangostream2/'>Reject </a>\r\n` +
        "</page>\r\n" +
        "</pages>";
      res.header({ "Content-Type": "text/xml", Accept: "text/xml" });
      res.send(USSDwrapper);
      //res.write(USSDwrapper);
    })
    .catch((error) => {
      console.log(error);
    });

  app.get("/tangostream/", (req, res) => {
    const name = result.FNAME;
    const lname = result.LNAME;
    const nationality = result.nationality;
    const idnumber = result.individualIdentification[2].identificationId;
    const gender = result.GENDER;
    function setGender() {
      if (gender === "M") {
        return "Male";
      } else {
        return "Female";
      }
    }
    let ngender = setGender(gender);
    const dob = result.DOB;
    let ndob = new Date(dob);
    function appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    }
    let newdob =
      ndob.getDate() +
      "" +
      appendLeadingZeroes(ndob.getMonth() + 1) +
      "" +
      ndob.getFullYear();

    const options = {
      processEntities: true,
      ignoreAttributes: false,
      format: true,
    };

    const builder = new XMLBuilder(options);
    const json = builder.build(result);
    const format =
      '<?xml version="1.0"?>' +
      `<COMMAND>
           <TYPE>CUSTREG</TYPE>
           <PREFIX></PREFIX>
           <REGTYPEID>No_KYC</REGTYPEID>
           <FNAME>${name}</FNAME>
           <LNAME>${lname}</LNAME>
           <MIDDLENAME></MIDDLENAME>
           <NATIONALITY>${nationality}</NATIONALITY>
           <MSISDN>${phone}</MSISDN>
           <IDNUMBER>${idnumber}</IDNUMBER>
           <FORMNO></FORMNO>
           <IDTYPE></IDTYPE>
           <IDTYPENUMBER></IDTYPENUMBER>
           <PLACEOFISSID></PLACEOFISSID>
           <ISSUECNTRY></ISSUECNTRY>
           <RESIDENCECNTRY></RESIDENCECNTRY>
           <ISSUEDATE></ISSUEDATE>
           <EXPDATE></EXPDATE>
           <PREFLANG></PREFLANG>
           <DOB>${newdob}</DOB>				
           <GENDER>${ngender}</GENDER>			
           <ADDRESS></ADDRESS>
           <CITY></CITY>
           <DISTRICT></DISTRICT>
           <STATE></STATE>
           <POSTALCODE></POSTALCODE>
           <EMPNAME></EMPNAME>
           <REMARKS></REMARKS>
           <PROVIDER>101</PROVIDER>		
           <PAYID>12</PAYID>
           <BLOCKSMS></BLOCKSMS>
           </COMMAND>`;

    var postRequest = {
      host: "172.25.160.27",
      path: "/tango/mmoney/CelliciumSelector?REQUEST_GATEWAY_CODE=WEB&REQUEST_GATEWAY_TYPE=WEB&LOGIN=Web_Bearer2&PASSWORD=b3Jhbmdlb205MDg3Ym90&SOURCE_TYPE=BROWSER",
      port: 50070,
      method: "POST",
      headers: {
        //'Cookie': "cookie",
        "Content-Type": "text/xml",
        "Content-Length": Buffer.byteLength(format),
      },
    };
    var confirmwrapper;
    var req = http.request(postRequest, function (res) {
      console.log(res.statusCode);
      var buffer = "";
      res.on("data", function (data) {
        //do stuff  mit data
        var tangoresponse = data.toString();
        const options = {
          ignoreAttributes: false,
        };

        const parser = new XMLParser(options);
        let jsonObj = parser.parse(tangoresponse);
        const {
          COMMAND: { MESSAGE },
        } = jsonObj;
        const message = MESSAGE;
        
        var confirmcontent = message;
        confirmwrapper =
          "<?xml version='1.0' encoding='UTF-8'?>\r\n" +
          "<!DOCTYPE pages SYSTEM 'cellflash.dtd'>\r\n" +
          "<pages descr='' >\r\n" +
          "<page  descr='Orange Money' hist='dohist' nav='default' ismenu='true' volatile='false'>\r\n" +
          confirmcontent +
          "</page>\r\n" +
          "</pages>";

          console.log(message);
          console.log(confirmwrapper);
      });
    });

    req.on("error", function (e) {
      console.log("problem with request: " + e.message);
    });

    //console.log(res.tangoresponse);
    //console.log(ussdmessage);

    res.header({ "Content-Type": "text/xml", Accept: "text/xml" });
    req.write(format);
    res.send(confirmwrapper);
    req.end();
  });

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
});

//Server Middleware
const PORT = process.env.PORT || 8090;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error: running this server");
  } else {
    console.log("This application is alive on http://TestServer:${PORT}");
  }
});
