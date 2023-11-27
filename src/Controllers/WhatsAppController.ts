import { Request, Response } from "express";
import { Worker } from "worker_threads";


//   export default useMongoDBAuthState
export function joinWhatsApp(req: Request, res: Response){

    const workerData = {
        key: "awaish",
        addNewGroup: true
    }
    // \Serri\whats_app_insights\dist\Services\WhatsAppConnectionService.ts

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