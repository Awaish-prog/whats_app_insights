import connectToMongoDB from "./MongoDBClient"

export async function createGroupDataDB(groupData: any, membersData: any) {
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

    groupStatsCollection.insertOne(groupstats)
    
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

export async function updateMembers(idToName: any){

    const members = await connectToMongoDB("members")

    const bulkOps = [];

    // Iterate through each ID in the mapping object
    for (const [id, name] of Object.entries(idToName)) {
      // Add update operation to the bulk operations array
      bulkOps.push({
        updateOne: {
          filter: { id: id },
          update: { $set: { name: name } },
        },
      });
    }

    if(bulkOps.length > 0){
        const result = await members.bulkWrite(bulkOps);
    }
}

export async function getGroupMembers(groupId: any){

    const members = await connectToMongoDB("members")
    
    const groupMembers = await members.find({ groupId }).toArray()
    
    return groupMembers
}