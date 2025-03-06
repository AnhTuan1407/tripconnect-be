import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

// Database
import dbConnect from "./configs/db.config.js";

// Routes
import route from "./routers/index.js";

const app = express();
const PORT = process.env.PORT || 8080;

const startServer = () => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.json());

  dbConnect();

  app.use(process.env.API_PREFIX, route);

  app.get("/", (req, res) => {
    res.send("API Capstone 2 Project - C2SE.02");
  });

  app.listen(PORT, () => {
    console.log(`🌐 Server is running on port ${PORT}`);
  });
};

(async () => {
  try {
    console.log("Starting Server...");
    startServer();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();