import useMongoDBAuthState from "../Db/SessionStore";
import connectToMongoDB from "../Db/MongoDBClient";
const { DisconnectReason } = require("@whiskeysockets/baileys");
const makeWASocket = require("@whiskeysockets/baileys").default;
import { Response } from "express";


async function connectToWhatsApp(key: string, res: Response) {
        
    const collection = await connectToMongoDB()
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
      else{
        console.log("************************************************************");
      }
      
      
      
    });


    
  
    sock.ev.on("messages.upsert", async (messageInfoUpsert: any) => {
      console.log("****************************** Upsert *************************************");
      
      console.log(JSON.stringify(messageInfoUpsert, undefined, 2));
      
      if(messageInfoUpsert.messages && messageInfoUpsert.messages[0] && messageInfoUpsert.messages[0].message && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation && messageInfoUpsert.messages[0].message.conversation.toLowerCase() === "serri"){
        console.log("Create data of group...");
        
      }
      
      
      
    });
    sock.ev.on("creds.update", saveCreds);
}

export default connectToWhatsApp

// const { authState, ev, query, upsertMessage } = sock;
      
    //   const groupQuery = async (jid: any, type: any, content: any) => (query({
    //     tag: 'iq',
    //     attrs: {
    //         type,
    //         xmlns: 'w:g2',
    //         to: jid,
    //     },
    //     content
    //   }));

    //   const result = await groupQuery("120363182286333692@g.us", 'get', [
    //     { tag: 'query',
    //     attrs: { request: 'interactive' },
    //     content: []
    //   }]);
  
    //   // const result = await sock.groupRequestParticipantsList("120363182286333692@g.us")
    
    //   // console.log(JSON.stringify(result.content[0], undefined, 2));
  
      
      
    //   console.log(JSON.stringify(result, undefined, 2));
  
    // sock.ev.on("messaging-history.set", ({ chats, contacts, messages, isLatest}: messageHistoryInterface) => {
    //   console.log("((((((((((((((((((((Message history))))))))))))))))))))))");
  
    //   console.log(chats);
    //   console.log(contacts);
    //   console.log(messages);
    // })
  
    // sock.ev.on("presence.update", ({ id, presences }: Presences) => {
    //   console.log("^^^^^^^^^^^^^^^^^^^^^ Presences Update ^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    //   console.log(id);
    //   console.log(presences);
      
      
    // })
  
    // sock.ev.on("contacts.upsert", (contacts: any) => {
    //   console.log("$$$$$$$$$$$$$$$$$$$$ Contacts $$$$$$$$$$$$$$$$$$$$");
    //   console.log(contacts);
      
      
    // })
    // sock.ev.on("groups.upsert", (groups: any) => {
    //   console.log("@@@@@@@@@@@@@@@@@@@ groups update @@@@@@@@@@@@@@@@@@");
    //   console.log(groups);
      
      
    // })
    // sock.ev.on("chats.upsert", (chats: any) => {
    //   console.log("&&&&&&&&&&&&&&&&&&&&& Chats Update &&&&&&&&&&&&&&&&&&&&&");
    //   console.log(chats);
      
      
    // })
  
  
    // sock.ev.on("messages.update", async (messageInfo: any) => {
    //   console.log("***************************************************************************");
    //   console.log(JSON.stringify(messageInfo, undefined, 2));
    // });

    // const groupQuery = async (jid: any, type: any, content: any) => (query({
      //     tag: 'iq',
      //     attrs: {
      //         to: '@g.us',
      //         // to: jid,
      //         xmlns: 'w:g2',
      //         type: 'get',
      //     },
      //     content: [
      //         {
      //             tag: 'participating',
      //                   attrs: {},
      //                   content: [
      //                       { tag: 'participants', attrs: {} },
      //                       { tag: 'description', attrs: {} }
      //                   ]
  
      //         }
      //     ]
      // }));
  
    //   {
    //     tag: 'iq',
    //     attrs: {
    //         to: '@g.us',
    //         xmlns: 'w:g2',
    //         type: 'get',
    //     },
    //     content: [
    //         {
    //             tag: 'participating',
    //             attrs: {},
    //             content: [
    //                 { tag: 'participants', attrs: {} },
    //                 { tag: 'description', attrs: {} }
    //             ]
    //         }
    //     ]
    // }