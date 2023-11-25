import { updateMembers, createGroupStats, getGroupFromDb, getGroupStatsFromDb, getGroupMembers, createGroupDataDB } from "../Db/GroupDataDB"
import sortArrayOfObjects from "../Utils/SortArrayOfObjects"


class GroupRepository{

    async createGroupData(groupMetaData: any) {
        const groupData = {
            id: groupMetaData.id,
            subject: groupMetaData.subject,
            memberCount: groupMetaData.size,
            createdAt: groupMetaData.creation,
        }

        const membersData = []
        const members = groupMetaData.participants
        for(let i = 0; i < members.length; i++){
            membersData.push({
                id: members[i].id,
                groupId: groupMetaData.id,
                isAdmin: members[i].admin === "admin" || members[i].admin === "superadmin" ? true : false
            })
        }
        
        
        createGroupDataDB(groupData, membersData)
    }

    async updateGroupsData(messagesData: any, participants: any, groupId: string){

        const groupStats: any = { }
            
        if(messagesData.length > 0){
            groupStats.groupId = groupId
            groupStats.id = messagesData[0].key.id
            groupStats.timeStamp = messagesData[0].messageTimestamp
            groupStats.numberOfMessages = 0
            groupStats.membersJoined = 0
            groupStats.membersLeft = 0
            groupStats.membersCount = participants.length
            groupStats.adminsCount = 0
        }
        
        for(let i = 0; i < participants.length; i++){
            if(participants[i].admin === "admin" || participants[i].admin === "superadmin"){
                groupStats.adminsCount += 1
            }
        }

        groupStats.messageSenders = {}
        const idNameMapping: any = { }
        for(let i = 0; i < messagesData.length; i++){ 
            if(messagesData[i].key.remoteJid === groupId){
                console.log(messagesData[i].messageStubType);
                
                if(messagesData[i].messageStubType && messagesData[i].messageStubType === 28){
                    groupStats.membersLeft += 1
                }
                else if(messagesData[i].messageStubType && messagesData[i].messageStubType === 27){
                    groupStats.membersJoined += 1    
                }
                else if(groupStats.messageSenders[messagesData[i].key.participant] && messagesData[i].messageStubType && messagesData[i].messageStubType === 2){
                    groupStats.messageSenders[messagesData[i].key.participant] += 1
                    groupStats.numberOfMessages += 1
                }
                else{
                    groupStats.numberOfMessages += 1
                    groupStats.messageSenders[messagesData[i].key.participant] = 1
                }
                
                idNameMapping[messagesData[i].key.participant] = messagesData[i].pushName
            }
            
        }


        createGroupStats(groupStats)
        updateMembers(idNameMapping)
    }

    async getGroupsStats(groupId: string, startDate: number, endDate: number){

        const groupStats = await getGroupStatsFromDb(groupId, startDate, endDate)

        let groupmembers = await getGroupMembers(groupId)
        
        const groupStatsData: any = {
            numberOfMessages: 0,
            messageSenders: {  },
            membersLeft: 0,
            membersJoined: 0,
            totalMembers: [],
            adminsCount: []
        }

        const groupMembersObject: any = { }

        for(let i = 0; i < groupmembers.length; i++){
            groupMembersObject[groupmembers[i].id] = groupmembers[i]
        }

        
        for(let i = 0; i < groupStats.length; i++){
            groupStatsData.numberOfMessages += groupStats[i].numberOfMessages
            const messageSendersKeys = Object.keys(groupStats[i].messageSenders)
            groupStatsData.membersLeft += groupStats[i].membersLeft
            groupStatsData.membersJoined += groupStats[i].membersJoined
            groupStatsData.totalMembers.push(groupStats[i].membersCount)
            groupStatsData.adminsCount.push(groupStats[i].adminsCount)
            for(let j = 0; j < messageSendersKeys.length; j++){
                if(!groupStatsData.messageSenders.hasOwnProperty(messageSendersKeys[j])){
                    groupStatsData.messageSenders[messageSendersKeys[j]] = {
                        messagesCount: 0,
                        name: groupMembersObject[messageSendersKeys[j]].name,
                        id: groupMembersObject[messageSendersKeys[j]].id
                    }
                }
                
                groupStatsData.messageSenders[messageSendersKeys[j]].messagesCount += groupStats[i].messageSenders[messageSendersKeys[j]]

            }
        }

        groupStatsData.totalActiveMembers = Object.keys(groupStatsData.messageSenders).length

        const messageSendersInStats = Object.keys(groupStatsData.messageSenders)

        const membersInInteractionOrder: any = []


        for(let i = 0; i < messageSendersInStats.length; i++){
            membersInInteractionOrder.push(
                groupStatsData.messageSenders[messageSendersInStats[i]]
            )
        }
        
        
        

        groupStatsData.messageSenders = sortArrayOfObjects(membersInInteractionOrder)


        return { groupStatsData }
        
    }
}

export const groupRepository = new GroupRepository()