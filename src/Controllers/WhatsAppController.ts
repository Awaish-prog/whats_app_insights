import { Request, Response } from "express";
import { Worker } from "worker_threads";
import { WorkerData } from "../Types/WorkerData";



export function joinWhatsApp(req: Request, res: Response){

    const workerData: WorkerData = {
        key: "awaish",
        addNewGroup: true
    }

    const worker = new Worker("./dist/Services/WhatsAppConnectionService.js", {
        workerData,
    });

    worker.on("message", (message) => {

        if(message === "terminate"){
            worker.terminate()
        }
        else{
            res.status(200).send(message)
        }
        
    })

}