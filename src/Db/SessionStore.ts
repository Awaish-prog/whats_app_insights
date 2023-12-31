const { Curve, signedKeyPair } = require("@whiskeysockets/baileys/lib/Utils/crypto");
const { generateRegistrationId } = require("@whiskeysockets/baileys/lib/Utils/generics");
const { randomBytes } = require("crypto");
const { proto } = require("@whiskeysockets/baileys/WAProto");

const initAuthCreds = () => {
    const identityKey = Curve.generateKeyPair();
    return {
      noiseKey: Curve.generateKeyPair(),
      signedIdentityKey: identityKey,
      signedPreKey: signedKeyPair(identityKey, 1),
      registrationId: generateRegistrationId(),
      advSecretKey: randomBytes(32).toString("base64"),
      processedHistoryMessages: [],
      nextPreKeyId: 1,
      firstUnuploadedPreKeyId: 1,
      accountSettings: {
        unarchiveChats: false,
      },
    };
};
  
const BufferJSON = {
    replacer: (k:any, value: any) => {
      if (
        Buffer.isBuffer(value) ||
        value instanceof Uint8Array ||
        value?.type === "Buffer"
      ) {
        return {
          type: "Buffer",
          data: Buffer.from(value?.data || value).toString("base64"),
        };
      }
  
      return value;
    },
  
    reviver: (_: any, value: any) => {
      if (
        typeof value === "object" &&
        !!value &&
        (value.buffer === true || value.type === "Buffer")
      ) {
        const val = value.data || value.value;
        return typeof val === "string"
          ? Buffer.from(val, "base64")
          : Buffer.from(val || []);
      }
  
      return value;
    },
};
  
const useMongoDBAuthState = async (collection: any , key: string) => {
      
    const writeData = (data: any, id: any) => {
      const informationToStore = JSON.parse(
        JSON.stringify(data, BufferJSON.replacer)
      );
      const update = {
        $set: {
          ...informationToStore,
        },
      };
      return collection.updateOne({ _id: id }, update, { upsert: true });
    };
    const readData = async (id: any) => {
      try {
        const data = JSON.stringify(await collection.findOne({ _id: id }));
        return JSON.parse(data, BufferJSON.reviver);
      } catch (error) {
        return null;
      }
    };
    const removeData = async (id: any) => {
      try {
        await collection.deleteOne({ _id: id });
      } catch (_a) {}
    };
    const creds = (await readData(key)) || (initAuthCreds)();
    return {
      state: {
        creds,
        keys: {
          get: async (type: any, ids: any) => {
            const data: any = {};
            await Promise.all(
              ids.map(async (id: any) => {
                let value = await readData(`${type}-${id}`);
                if (type === "app-state-sync-key") {
                  value = proto.Message.AppStateSyncKeyData.fromObject(data);
                }
                data[id] = value;
              })
            );
            return data;
          },
          set: async (data: any) => {
            const tasks = [];
            for (const category of Object.keys(data)) {
              for (const id of Object.keys(data[category])) {
                const value = data[category][id];
                const key = `${category}-${id}`;
                tasks.push(value ? writeData(value, key) : removeData(key));
              }
            }
            await Promise.all(tasks);
          },
        },
      },
      saveCreds: () => {
        return writeData(creds, key);
      },
      removeSession: () => {
        removeData(key)
      }
    };
  };

export default useMongoDBAuthState