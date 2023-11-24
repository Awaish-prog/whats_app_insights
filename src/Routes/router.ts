import express from "express";
import { joinWhatsApp } from "../Controllers/WhatsAppController";
import { getGroupStats } from "../Controllers/GroupStatsController";


const router = express.Router();

router.get("/join_whats_app", joinWhatsApp)
router.post("/get_group_stats", getGroupStats)


export default router;