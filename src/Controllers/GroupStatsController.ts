import { Request, Response } from "express";
import { groupRepository } from "../Repository/groups.repository";
import { convertDateToSeconds } from "../Utils/ConvertDateToMilliseconds";
import { GetGroupStatsObject } from "../Types/GroupTypes";

export async function getGroupStats(req: Request, res: Response){
      
    let  { groupId, startDate, endDate }: GetGroupStatsObject = req.body

    let startTimeStamp: number = 0
    let endTimeStamp: number = 9999999999

    if(startDate){
        startTimeStamp = convertDateToSeconds(startDate, "12:00 AM")
    }
  

    if(endDate){
        endTimeStamp = convertDateToSeconds(endDate, "12:00 AM")
    }
   
    
    const groupStats = await groupRepository.getGroupsStats(groupId, startTimeStamp, endTimeStamp)
    res.json(groupStats)
}