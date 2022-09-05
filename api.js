// require("dotenv").config();
const express = require("express");
const app = express();
const { default: axios } = require("axios");

// app.get("/test", (req, res) => {
//     res.status(200).send({
//         name: 'Salim',
//         number: '78161701'
//     })
// })

app.post("/self-register/:phone", (req, res) => {
  const { phone } = req.params;

  //     //Create a connection to BI database

  //     //query the BI database

  //     //parse the collected data from BI to xml

  //     //send the xml result to Tango

  res.send(`API connected Successfully to ${phone}`);
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

// //GET
// axios
//   .post("/self-register/:phone", (req,res) => {
//     const {phone} = req.params

//     //Create a connection to BI database

//     //query the BI database

//     //parse the collected data from BI to xml

//     //send the xml result to Tango
// })
