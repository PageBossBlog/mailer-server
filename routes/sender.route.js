import express from "express";
import {
  senderEmail,
} from "../controllers/sender.controller.js";

const router = express.Router();

router.post("/send", senderEmail);

export default router;
