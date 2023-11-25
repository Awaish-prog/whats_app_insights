
export default function sortArrayOfObjects(objectArray: Array<any>){
    return objectArray.sort((a, b) => {
        if(a.messagesCount > b.messagesCount){
            return -1
        }    
        if(a.messagesCount < b.messagesCount){
            return 1
        }

        return 0
    
    })
}