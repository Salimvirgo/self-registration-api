// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const helmet = require("helmet")
var http = require("http");
//require("body-parser-xml")(bodyParser);
const { default: axios } = require("axios");
const USSDMenu = require("ussd-menu-builder");
const { buildXMLFromJSON, createUSSDWrapper } = require("./helper/helpers");

const app = express();
let menu = new USSDMenu();
let iPacsResponseData = {};

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

app.use(helmet.hidePoweredBy());
// app.disable("x-powered-by");
app.set("etag", false); // turn off

//API entry point
app.get("/self-register/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
  // set url as constant
  const URL = `http://172.25.172.31:8086/get/Party?publicKey=${phone}&productStatus=ACTIVE`;

  //axios get request
  const { data } = await axios
    .get(URL, { headers: { "Content-Type": "text/xml" } })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.sendStatus(err.code);
      }
    });

  let { gender, nationality, birthDate, givenName, familyName, middleName } =
    data;

  let { identificationId } = data.individualIdentification[2];
  birthDate = moment(birthDate).format("DDMMYYYY");
  gender = gender === "M" ? "Male" : "FEMALE";

  const USSDResponse = `${givenName} ${familyName} ${birthDate} ${identificationId}`;

  const userConfirmationContent = `Please read and confirm Registration details: <br/> ${USSDResponse} </br>`;

  //envelope to send to Tango
  const USSDWrapper = createUSSDWrapper(userConfirmationContent)

  iPacsResponseData = {
    gender,
    nationality,
    birthDate,
    givenName,
    familyName,
    middleName,
    identificationId,
    phone
  };

  res.header({ "Content-Type": "text/xml", Accept: "text/xml" });
  res.send(USSDWrapper);
  console.log("Sent USSD Response to user");
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

//USSD option 1 call
app.get("/tango-stream?:response", async (req, res) => {
  try {
    const { response } = req.query;

    if (typeof response === "undefined" || !response) {
      return res.sendStatus(401);
    }

    if (response === "Confirm") {

      if (Object.keys(iPacsResponseData).length) {
        const iPacsXMLData = buildXMLFromJSON(iPacsResponseData);

        //SEND DATA TO TANGO

        var postRequest = {
            host: "172.25.160.27",
            path: "/tango/mmoney/CelliciumSelector?REQUEST_GATEWAY_CODE=WEB&REQUEST_GATEWAY_TYPE=WEB&LOGIN=Web_Bearer2&PASSWORD=b3Jhbmdlb205MDg3Ym90&SOURCE_TYPE=BROWSER",
            port: 50070,
            method: "POST",
            headers: {
                'Cookie': "cookie",
                'Content-Type': 'text/xml',
                'Content-Length': Buffer.byteLength(iPacsXMLData)
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
                    return
      
          const tangoURL = `http://172.25.160.27:50070/tango/mmoney/CelliciumSelector?REQUEST_GATEWAY_CODE=WEB&REQUEST_GATEWAY_TYPE=WEB&LOGIN=Web_Bearer2&PASSWORD=b3Jhbmdlb205MDg3Ym90&SOURCE_TYPE=BROWSER`;
          const axiosHeaderOptions = {
            headers: {
                'Accept':'text/xml',
                'Cookie': "cookie",
                'Content-Type': 'text/xml',
               
            }
          }
         const tangoResponse = await axios.post(tangoURL,iPacsXMLData,axiosHeaderOptions).catch((err) => {throw err})
         console.log("Tango Response ")
         console.log(tangoResponse)
          
        res.send("Registration Successful");
      } else {
        res.sendStatus(400);
      }
    }

    if (response === "Reject") {
      //todo redirect to normal orange money flow
      const rejectcontent1 = '<form action="/tangostream3/namevalue" method="GET"><entry type="text" var="namevalue"><prompt>Please Enter your First and Middle Name </prompt></entry></form>';
const rejectwrapper = "<?xml version='1.0' encoding='UTF-8'?>\r\n" +
                        "<!DOCTYPE pages SYSTEM 'cellflash.dtd'>\r\n" +
                        "<pages descr='' >\r\n" +
                        "<page  descr='Orange Money' hist='dohist' nav='default' ismenu='false' volatile='false'>\r\n" + 
                        rejectcontent1 +   
                        "</page>\r\n" +
                        "</pages>"
;  
      const name = namevalue;
      console.log(name);
      res.header({ 'Content-Type': 'text/xml', 'Accept': 'text/xml'});
      res.send(rejectwrapper);
      
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
