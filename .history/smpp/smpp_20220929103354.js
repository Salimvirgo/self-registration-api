const http = require("http");
const smpp = require("smpp");
const axios = require("axios");
//const session = new smpp.Session({host: '172.25.177.113', port: 8091});

//const requestor = "Joey";
const numbers = ["tel:+23278161701"];
const driverName = "Sallu Kamara";
const vehicleReg = "AER 123";
const driverNumber = "tel:+23276450047";

exports.SendSMSAlert = (phone, message) => {
  try {
    const outBoundTextMessage = {
      message:
        "Subscriber with this MSISDN is successfully registered. To complete your Orange Money registration, Send a copy of your valid ID card via whatsapp to 073235786 or 074013333.",
    };
    const data = {
      outboundSMSMessageRequest: {
        address: phone,
        senderAddress: "tel:OrangeMoney",
        outboundSMSTextMessage: outBoundTextMessage,
        clientCorrelator: "123456",
        receiptRequest: {
          notifyURL:
            "http://172.25.177.113:8080/app/notifications/DeliveryInfoNotification",
          callbackData: "request1",
        },
        senderName: "OrangeMoney",
      },
    };

    const username = "VeHcRst";
    const password = "VeHcRst";
    const postFields = data;
    const key = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );
    const postData = JSON.stringify(postFields);

    const options = {
      hostname: "172.25.177.31",
      port: "8091",
      path: "/smsmessaging/v1/outbound/3030/requests",
      method: "POST",
      headers: {
        Authorization: "Basic " + key,
        "Content-Type": "application/json",
      },
    };

    const callback = (response) => {
      var str = "";
      response.on("data", (chunk) => {
        str += chunk;
      });

      response.on("end", () => {
        console.log(str);
      });
    };
    // Start the web request.
    var smsrequest = http.request(options, callback);

    // Send the real data away to the server.
    smsrequest.write(postData);

    // Finish sending the request.
    smsrequest.end();
  } catch (error) {
    console.log("An eRROR Occured" + error);
  }
};

exports.SendSMSAlert2 = (phone,message) => {
  try {
    const outBoundTextMessage = {
      message: message,
    };
    const data = {
      outboundSMSMessageRequest: {
        address: phone,
        senderAddress: "tel:OrangeMoney",
        outboundSMSTextMessage: outBoundTextMessage,
        clientCorrelator: "123456",
        receiptRequest: {
          notifyURL:
            "http://172.25.177.113:8080/app/notifications/DeliveryInfoNotification",
          callbackData: "request1",
        },
        senderName: "OrangeMoney",
      },
    };

    const username = "VeHcRst";
    const password = "VeHcRst";
    const postFields = data;
    const key = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );
    const postData = JSON.stringify(postFields);

    const options = {
      hostname: "172.25.177.31",
      port: "8091",
      path: "/smsmessaging/v1/outbound/3030/requests",
      method: "POST",
      headers: {
        Authorization: "Basic " + key,
        "Content-Type": "application/json",
      },
    };

    const callback = (response) => {
      var str = "";
      response.on("data", (chunk) => {
        str += chunk;
      });

      response.on("end", () => {
        console.log(str);
      });
    };
    // Start the web request.
    var smsrequest = http.request(options, callback);

    // Send the real data away to the server.
    smsrequest.write(postData);

    // Finish sending the request.
    smsrequest.end();
  } catch (error) {
    console.log("An eRROR Occured" + error);
  }
};

//SendSMSAlert(requestor,numbers,driverName,vehicleReg)

//module.exports = { callback, options, postData};
