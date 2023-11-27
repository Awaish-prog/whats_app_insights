import express from "express";
import { joinWhatsApp } from "../Controllers/WhatsAppController";
import { getGroupStats } from "../Controllers/GroupStatsController";
import { srcapWhatsAppData } from "../ScheduledTasks/ScheduledTask";



const router = express.Router();

router.get("/join_whats_app", joinWhatsApp)
router.post("/get_group_stats", getGroupStats)
router.get("/scrap_whatsapp_data", srcapWhatsAppData)


export default router;