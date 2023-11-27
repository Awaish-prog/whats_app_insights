import useMongoDBAuthState from "../Db/SessionStore";
import connectToMongoDB from "../Db/MongoDBClient";
const { DisconnectReason } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;
import { groupRepository } from "../Repository/groups.repository";
import { parentPort, workerData } from "worker_threads";

const { key, addNewGroup, jid, subject } = workerData


async function connectToWhatsApp() {
        
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
            connectToWhatsApp();
          return
        }
        console.log("Disconnected");
        removeSession()
        

        
        
      }

      if (qr) {
        console.log(qr);
        // write custom logic over here
        parentPort?.postMessage(qr)
      }
    })

  
    sock.ev.on("messages.upsert", async (messageInfoUpsert: any) => {
      
      
      if(addNewGroup && messageInfoUpsert.messages && messageInfoUpsert.messages[0] && messageInfoUpsert.messages[0].message && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation.toLowerCase() === "serri"){
        
        const metadata = await sock.groupMetadata(messageInfoUpsert.messages[0].key.remoteJid);
        
        await groupRepository.createGroupData(metadata, key)

        parentPort?.postMessage("terminate")
      }
      
      if(messageInfoUpsert.type === "append" && !addNewGroup){

        const metadata = await sock.groupMetadata(jid)

        console.log(metadata);
        
        
        await groupRepository.updateGroupsData(messageInfoUpsert.messages, metadata.participants, jid, subject)
        parentPort?.postMessage("terminate")
      }
      
    });
    sock.ev.on("creds.update", saveCreds);
}

connectToWhatsApp()