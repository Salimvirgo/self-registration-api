const { XMLBuilder, XMLParser } = require("fast-xml-parser");

// class Helper {
//   constructor() {}

//   jsonToXml(json, config = null) {
//     let options = {
//       attributeNamePrefix: "@",
//       textNodeName: "$",
//       ignoreAttributes: false,
//       tagValueProcessor: (a) =>
//         he.encode(a.toString(), { useNamedReferences: false }),
//     };
//     // const parser = new XMLParser(options);
//     const builder = new XMLBuilder(options);
//     const output = builder.build(result);
//     // let xml = builder.build({
//     //   Name: "Salim",
//     //   Number: "23276161701",
//     // });
//     return '<?xml version="1.0" encoding="utf-8"?>' + xml;
//   }
// }

// module.exports = new Helper();


exports.buildXMLFromJSON = (JSONData) => {

  //todo check if the correct Json data is being sent 
    const {givenName,familyName,middleName,birthDate, gender, nationality,identificationId,phone} = JSONData
    const xmlData = {
        TYPE: "CUSTREG",
        PREFIX: "",
        REGTYPEID: "No_KYC",
        FNAME: givenName,
        LNAME: familyName,
        MIDDLENAME: middleName,
        NATIONALITY: nationality,
        MSISDN: phone,
        IDNUMBER: identificationId,
        FORMNO: "",
        IDTYPE: "",
        IDTYPENUMBER: "",
        PLACEOFISSID: "",
        ISSUECNTRY: "",
        RESIDENCECNTRY: "",
        ISSUEDATE: "",
        EXPDATE: "",
        PREFLANG:"",
        DOB: birthDate,
        GENDER: gender,
        ADDRESS: "",
        CITY: "",
        DISTRICT: "",
        STATE: "",
        POSTALCODE: "",
        EMPNAME: "",
        REMARKS: "",
        PROVIDER: "101",	
        PAYID: "12",
        BLOCKSMS: ""
      };
    
      const xmlBuilderOptions = {
        processEntities: true,
        ignoreAttributes: false,
        format: true,
      };
    
      const xmlBuilder = new XMLBuilder(xmlBuilderOptions);
      const builderJSON = xmlBuilder.build(xmlData);
      const format =
        '<?xml version="1.0"?>\n\r' +
        `<COMMAND>\n\r${builderJSON}</COMMAND>`;

    return format;
}

exports.