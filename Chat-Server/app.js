const express = require("express");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/indexRoute");

const app = express();
app.use(
    cors({
      origin: "http://localhost:3000",
  
      
  
      credentials: true, //
      
  
      //   Access-Control-Allow-Credentials is a header that, when set to true , tells browsers to expose the response to the frontend JavaScript code. The credentials consist of cookies, authorization headers, and TLS client certificates.
    })
)  

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const limited = rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again in an hour"
});

app.use("/tawk", limited);
app.use(router);

module.exports = app;
