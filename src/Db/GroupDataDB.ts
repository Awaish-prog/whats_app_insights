import { GroupType } from "../Types/GroupTypes";
import { MembersData } from "../Types/MemberTypes";
import connectToMongoDB from "./MongoDBClient"

export async function createGroupDataDB(groupData: GroupType, membersData: Array<MembersData>) {
    const groupCollection = await connectToMongoDB("groups")

    const groupDocument = await groupCollection.findOne({ id: groupData.id })
    
    if(groupDocument){
        console.log("This group already exists...");
        return
    }

    await groupCollection.insertOne(groupData)

    const membersCollection = await connectToMongoDB("members")

    await membersCollection.insertMany(membersData)
    
    
}

export async function createGroupStats(groupstats: any){
    
    const groupStatsCollection = await connectToMongoDB("groupStats")

    await groupStatsCollection.insertOne(groupstats)
    
}

export async function getGroupStatsFromDb(groupId: string, startDate: number, endDate: number){

    const groupStatsCollection = await connectToMongoDB("groupStats")

    const groupStats = await groupStatsCollection.find({
        groupId: groupId,
        timeStamp: {
            $gte: startDate,
            $lt: endDate
        }
    }).toArray();

    return groupStats
    

}

export async function getGroupFromDb(groupId: string){
    const groupCollection = await connectToMongoDB("groups")

    const groupDocument = await groupCollection.findOne({ id: groupId })

    return groupDocument
}

export async function updateMembers(idToName: any, idToAdmin: any){

    const members = await connectToMongoDB("members")

    const bulkOpsName = [];
    const bulkOpsAdmin = [];

    const ids = Object.keys(idToName)
    const adminIds = Object.keys(idToAdmin)

    for (let i = 0; i < ids.length; i++) {
      bulkOpsName.push({
        updateOne: {
          filter: { id: ids[i] },
          update: { $set: { name: idToName[ids[i]].name } },
        },
      });
    }

    for (let i = 0; i < adminIds.length; i++) {
        bulkOpsAdmin.push({
          updateOne: {
            filter: { id: adminIds[i] },
            update: { $set: { isAdmin: idToAdmin[adminIds[i]].isAdmin } },
          },
        });
      }
    if(bulkOpsName.length > 0){
        const result = await members.bulkWrite(bulkOpsName);
    }
    if(bulkOpsAdmin.length > 0){
        const result = await members.bulkWrite(bulkOpsAdmin);
    }
}

export async function getGroupMembers(groupId: any){

    const members = await connectToMongoDB("members")
    
    const groupMembers = await members.find({ groupId }).toArray()
    
    return groupMembers
}

export async function getAllGroups(){
    const groups = await connectToMongoDB("groups")
    
    const allGroups = await groups.find().toArray()
    
    return allGroups
}

export async function addMembers(members: Array<MembersData>){
    const membersDB = await connectToMongoDB("members")

    await membersDB.insertMany(members)
}

export async function deleteMembers(members: Array<MembersData>){
    const membersDB = await connectToMongoDB("members")

    await membersDB.deleteMany({ $or: members });
}