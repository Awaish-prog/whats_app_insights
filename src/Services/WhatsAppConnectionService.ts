import useMongoDBAuthState from "../Db/SessionStore";
import connectToMongoDB from "../Db/MongoDBClient";
const { DisconnectReason } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;
import { Response } from "express";
import { groupRepository } from "../Repository/groups.repository";


async function connectToWhatsApp(key: string, res: Response) {
        
    const collection = await connectToMongoDB("auth_info_baileys")
    const { state, saveCreds, removeSession } = await useMongoDBAuthState(collection, key);
    let sock = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      qrTimeout: 500000,
      
    });
  
    sock.ev.on("connection.update", async (update: any) => {
      const { connection, lastDisconnect, qr } = update || {};
      
      
      
      
  
      if (connection === "close") {
        let shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;
  
        
        if (shouldReconnect) {
            connectToWhatsApp(key, res);
          return
        }
        console.log("Disconnected");
        removeSession()
        

        
        
      }

      if (qr) {
        console.log(qr);
        // write custom logic over here

        return res.end(qr)
      }
    })

    // sock.ev.on("messages.reaction", (reactions: any) => {
    //   console.log(reactions);
      
    // })

  
    sock.ev.on("messages.upsert", async (messageInfoUpsert: any) => {
      console.log("****************************** Upsert *************************************");
      
      console.log(JSON.stringify(messageInfoUpsert, undefined, 2));
      
      
      if(messageInfoUpsert.messages && messageInfoUpsert.messages[0] && messageInfoUpsert.messages[0].message && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation.toLowerCase() === "serri"){
        
        const metadata = await sock.groupMetadata(messageInfoUpsert.messages[0].key.remoteJid);
        
        groupRepository.createGroupData(metadata)
        
      }
      
      if(messageInfoUpsert.type === "append"){

        const metadata = await sock.groupMetadata(messageInfoUpsert.messages[0].key.remoteJid)
        
        groupRepository.updateGroupsData(messageInfoUpsert.messages, metadata.participants, messageInfoUpsert.messages[0].key.remoteJid)
      }
      
      
      console.log("Endd...");
      
    });
    sock.ev.on("creds.update", saveCreds);
}

export default connectToWhatsApp
