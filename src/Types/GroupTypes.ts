export type GetGroupStatsObject = {
    groupId: string, 
    startDate: string, 
    endDate: string
}

export type GroupType = {
    id: string,
    subject: string,
    memberCount: number,
    createdAt: number,
    key: string,
    _id?: any
}

export type GroupStatsData = {
    numberOfMessages: number,
    messageSenders: any,
    membersLeft: number,
    membersJoined: number,
    totalMembers: Array<number>,
    adminsCount: Array<number>,
    totalActiveMembers: number
}