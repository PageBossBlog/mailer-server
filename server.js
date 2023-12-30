import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import senderRoute from "./routes/sender.route.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: ["http://localhost:3000", "https://test-node-sender.onrender.com", "https://premium-nodemailer.onrender.com", "https://node-sender-bb4y0.onrender.com", "https://node-sender-stillbroke.onrender.com"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Use your existing routes
app.use("/nodemailer", senderRoute);

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Default route
app.use("/", (req, res) => {
  res.send("Welcome to Nodemailer Sender!");
});

const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Sender is running on port ${port}`);
});
