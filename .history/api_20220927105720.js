// require("dotenv").config();
const express = require("express");
const app = express();
const { default: axios } = require("axios");
const { XMLBuilder } = require("fast-xml-parser");
const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();
var http = require("http");
const moment = require("moment");
const { Console } = require("console");
const { stringify } = require("querystring");


app.post("/self-register/:phone", (req, res) => {
  const { phone } = req.params;
  // set url as constant
  const URL = `http://172.25.172.31:8086/get/Party?publicKey=${phone}&productStatus=ACTIVE`;
  var Regdata = [];
  axios
    .get(URL)
    .then((response) => {
      Regdata = response.data;
      data.toS

      //     //parse the collected data to xml
      const rename_keys = (keysMap, Regdata) =>
        Object.keys(Regdata).reduce(
          (acc, key) => ({
            ...acc,
            ...{ [keysMap[key] || key]: Regdata[key] },
          }),
          {}
        );

      console.log("-------------------------------------");
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
      // console.log("New Object");
      console.log(result);
      const name = Stringify(result.FNAME);
      const lname = result.LNAME;
      const nationality = result.nationality;
      const idnumber = result.individualIdentification[2].identificationId;
      const gender = result.GENDER;
        const newName = 

      function setGender() {
        if (gender === "M"){
          return "Male";
        } else {
          return "Female";
        }
      }
      
      let ngender = setGender(gender);
      const dob = result.DOB;

      let ndob = new Date(dob)
      function appendLeadingZeroes(n){
        if(n <= 9){
          return "0" + n;
        }
        return n
      }
      let newdob = ndob.getDate() + "" + appendLeadingZeroes(ndob.getMonth() + 1) + "" + ndob.getFullYear()
      console.log(newdob)
      
      

      const options = {
        processEntities: true,
        ignoreAttributes: false,
        format: true,
      };

      const builder = new XMLBuilder(options);
      const json = builder.build(result);

      const USSDresponse = `${name} ${lname} ${dob}`;

      console.log(USSDresponse);

      const format = '<?xml version="1.0"?>' +
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

      //     Build USSD
      if (format.length !== 0) {
        // Define menu states
        menu.startState({
          run: () => {
            // use menu.con() to send response without terminating session

            menu.con(
              "Please read and confirm Registration details:  " +
                "\n1. Confirm" +
                "\n2. Reject"
            );
          },
          // next object links to next state based on user input
          next: {
            1: "Confirm",
            2: "Reject",
          },
        });

        menu.state("Confirm", {
          run: () => {
            // End Session and send message
            menu.end("Your have successfully registered to Orange Money");
          },
        });
        menu.state("Reject", {
          run: () => {
            menu.end(
              "Please visit a nearby Orange shop with a valid ID card and register your sim"
            );
          },
        });

        // Registering USSD handler with Express

        app.post("/ussd", function (req, res) {
          menu.run(req.body, (ussdResult) => {
            res.send(ussdResult);
          });
        });
      }
      var postRequest = {
        host: "172.25.160.27",
        path: "/tango/mmoney/CelliciumSelector?REQUEST_GATEWAY_CODE=WEB&REQUEST_GATEWAY_TYPE=WEB&LOGIN=Web_Bearer2&PASSWORD=b3Jhbmdlb205MDg3Ym90&SOURCE_TYPE=BROWSER",
        port: 50070,
        method: "POST",
        headers: {
            'Cookie': "cookie",
            'Content-Type': 'text/xml',
            'Content-Length': Buffer.byteLength(format)
        }
      };
      
      var buffer = "";
      
      var req = http.request( postRequest, function( res )    {
      
       console.log( res.statusCode );
       var buffer = "";
       res.on( "data", function( data ) { buffer = buffer + data; } );
       res.on( "end", function( data ) { console.log( buffer ); } );
      
      });
      
      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      
      // req.write( format );
      req.end();
      res.send(`${USSDresponse}`);
      
      
    })
    .catch((error) => {
      console.log(error);
    });

});

//Server Middleware
const PORT = process.env.PORT || 8090;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error: running this server");
  } else {
    console.log(`This application is alive on http://localhost:${PORT}`);
  }
});
