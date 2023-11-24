import { Request, Response } from "express";
import { groupRepository } from "../Repository/groups.repository";
import { convertDateToSeconds } from "../Utils/ConvertDateToMilliseconds";

export async function getGroupStats(req: Request, res: Response){
      
    let  { groupId, startDate, endDate } = req.body

    if(!startDate){
        startDate = 0
    }
    else{
        startDate = convertDateToSeconds(startDate, "12:00 AM")
    }

    if(!endDate){
        endDate = 9999999999
    }
    else{
        endDate = convertDateToSeconds(endDate, "12:00 AM")
    }
    
    const groupStats = await groupRepository.getGroupsStats(groupId, startDate, endDate)
    res.json(groupStats)
}