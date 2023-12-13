import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import senderRoute from "./routes/sender.route.js";

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit for JSON payload
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase the limit for URL-encoded payload

app.use(cors({ origin: ["http://localhost:3000", "https://test-node-sender.onrender.com", "https://premium-nodemailer.onrender.com", "https://node-sender-bb4y0.onrender.com"], credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/nodemailer", senderRoute);

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.use("/", (req, res) => {
	res.send("Welcome to Nodemailer Sender!")
});

app.listen(8800, () => {
  console.log("Sender is running!");
});
