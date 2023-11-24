const { MongoClient } = require("mongodb");
import connectToMongoDB from "./MongoDBClient"

export async function createGroupData(groupData: any, membersData: any) {
    const groupCollection = await connectToMongoDB("groups")

    const groupDocument = await groupCollection.findOne({ id: groupData.id })
    console.log(groupDocument);
    
    if(groupDocument){
        console.log("This group already exists...");
        return
    }

    groupCollection.insertOne(groupData)

    const membersCollection = await connectToMongoDB("members")

    membersCollection.insertMany(membersData)
    
    
}

export async function createGroupStats(groupstats: any){
    
    const groupStatsCollection = await connectToMongoDB("groupStats")

    groupStatsCollection.insertMany(groupstats)
    
}

export async function getTotalNumberOfMessages(groupId: string, startDate: number, endDate: number){

    const groupStatsCollection = await connectToMongoDB("groupStats")

    const totalNumberOfMessages = await groupStatsCollection.find({
        groupId: groupId,
        timeStamp: {
            $gte: startDate,
            $lt: endDate
        }
    }).toArray();

    return totalNumberOfMessages
    

}