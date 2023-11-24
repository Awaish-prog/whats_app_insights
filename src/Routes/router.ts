import express from "express";
import { joinWhatsApp } from "../Controllers/WhatsAppController";


const router = express.Router();

router.get("/join_whats_app", joinWhatsApp)


export default router;