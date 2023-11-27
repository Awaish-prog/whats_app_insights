const schedule = require('node-schedule');
import { getAllGroups } from "../Db/GroupDataDB";
import { Worker } from "worker_threads";


export function runScheduledTasks(){
    const rule = new schedule.RecurrenceRule();

    schedule.scheduleJob("*/10 * * * * *", async function(){
        // const allGroups = await getAllGroups()

        // for (let i = 0; i < allGroups.length; i++) {
        //     console.log(allGroups[i]);
        // }
    });
}

function sleep(seconds: number){
    return new Promise((resolve, reject) => {
        setTimeout(() => {}, seconds * 1000)
    })
}

export async function srcapWhatsAppData() {
    
    const allGroups = await getAllGroups()
    
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