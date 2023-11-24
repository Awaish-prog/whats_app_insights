import { createGroupData, createGroupStats, getTotalNumberOfMessages } from "../Db/GroupDataDB"


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
        
        
        createGroupData(groupData, membersData)
    }

    async updateGroupsData(messagesData: any){

        const groupStats: any = { }

        const groupDailyStats = []

        console.log("Updating data");
        

        for(let i = 0; i < messagesData.length; i++){
            groupStats[messagesData[i].key.id] = {
                id: messagesData[i].key.id,
                groupId: messagesData[i].key.remoteJid,
                memberId: messagesData[i].key.participant,
                timeStamp: messagesData[i].messageTimestamp,
                memberName: messagesData[i].pushName
            } 
        }

        const keys = Object.keys(groupStats)

        for(let i = 0; i < keys.length; i++){
            
            groupDailyStats.push(groupStats[keys[i]])
        }

        createGroupStats(groupDailyStats)
    }

    async getGroupsStats(groupId: string, startDate: number, endDate: number){

        return await getTotalNumberOfMessages("120363182286333692@g.us", 1700856815, 1700856820)
        

    }
}

export const groupRepository = new GroupRepository()