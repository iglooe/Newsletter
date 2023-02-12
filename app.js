const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// create an instance of the express app
const app = express();

// Serve the files in the public directory as static files
app.use(express.static("public"));

// Parse incoming request bodies in a middleware before handlers
app.use(bodyParser.urlencoded({ extended: true }));

// Create a GET route to display the signup page
app.get("/", (req, res) => {
  // Send the signup.html file as a response to the client
  res.sendFile(__dirname + "/signup.html");
});

// Create a POST route to handle the form submissions
app.post("/", (req, res) => {
  // Get the first name, last name and email from the request body
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // Define the data object to be sent to Mailchimp API
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Convert the data object to a JSON string
  const jsonData = JSON.stringify(data);

  // URL for Mailchimp API
  const url = "https://us9.api.mailchimp.com/3.0/lists/9589811e5a";

  // Options for the request to the Mailchimp API
  const options = {
    method: "POST",
    auth: "sahil:Remove this and add your API key",
  };

  // Make a request to the Mailchimp API using the https module
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // Log the response data from Mailchimp API to the console
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // Write the data to the request body
  request.write(jsonData);
  // End the request
  request.end();
});

// Create a POST route to handle the form submissions
app.post("/failure", (req, res) => {
  res.redirect("/");
});

// Listen on port 3000 for incoming requests
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
