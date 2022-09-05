const { default: axios } = require("axios");

//GET
axios
  .post("/ip-address/self-register/:phone", (req,res) => {
    const {phone} = req.params

    //Create a connection to BI database
    
    //query the BI database

    //parse the collected data from BI to xml

    //send the xml result to Tango
})






