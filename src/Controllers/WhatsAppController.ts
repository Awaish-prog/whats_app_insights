import { Request, Response } from "express";
import connectToWhatsApp from "../Services/WhatsAppConnectionService";

  
//   export default useMongoDBAuthState
export function joinWhatsApp(req: Request, res: Response){
      
    connectToWhatsApp("awaish", res)
}