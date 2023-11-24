const { MongoClient } = require("mongodb");


const mongoURL: string = process.env.MONGO_DB_CONNECTION_STRING ? process.env.MONGO_DB_CONNECTION_STRING : ""


async function connectToMongoDB(collectionString: string) {
    
    const mongoClient = new MongoClient(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await mongoClient.connect();
  // const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const collection = mongoClient
        .db("whatsapp_api")
        .collection(collectionString);

    return collection
    
    
}

export default connectToMongoDB

