const schedule = require('node-schedule');
import { getAllGroups } from "../Db/GroupDataDB";
import { Worker } from "worker_threads";
import { GroupType } from "../Types/GroupTypes";


export function runScheduledTasks(){
    const rule = new schedule.RecurrenceRule();

    schedule.scheduleJob("0 0 0 * * *", async function(){
        // srcapWhatsAppData()   .... daily data fetch
    });
}



export async function srcapWhatsAppData() {
    
    const allGroups: Array<GroupType> = await getAllGroups()
    
    for (let i = 0; i < allGroups.length; i++) {
        console.log(allGroups[i]);
        const workerData = {
            key: allGroups[i].key,
            addNewGroup: false,
            jid: allGroups[i].id,
            subject: allGroups[i].subject
        }
    
        const worker = new Worker("./dist/Services/WhatsAppConnectionService.js", {
            workerData,
        });

        worker.on("message", (message) => {

            if(message === "terminate"){
                worker.terminate()
            }
            
        })
    }
}