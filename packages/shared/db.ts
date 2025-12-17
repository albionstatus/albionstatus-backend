import { FAILING_STATUS, SERVER_TO_DB } from './constants.js'
import { ServerName, Status } from './types.js'
import { MongoClient, Db, OptionalUnlessRequiredId } from 'mongodb'

export type StatusDocument = Status & {
  created_at: Date
}

type CreateDbClientArgs = {
  mongoUri: string,
  server: ServerName,
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

async function getMongoDb(mongoUri: string): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }
  
  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri, {
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
    })
    await cachedClient.connect()
  }
  
  cachedDb = cachedClient.db('albionstatus')
  return cachedDb
}

export async function createDbClient ({ mongoUri, server }: CreateDbClientArgs) {
  const db = await getMongoDb(mongoUri)
  const collection = db.collection<StatusDocument>(SERVER_TO_DB[server])

  async function getLastStatus (): Promise<Status> {
    try {
      const result = await collection.findOne({}, { sort: { created_at: -1 }, projection: { '_id': false } });
      if (!result) {
        console.log('No result found')
        return {
          type: 'unknown',
          message: 'No entries yet, the bot is probably booting up',
          comment: 'booting up',
        }
      }
      return result
    } catch (e) {
      console.error('Could not fetch current server status')
      if (e instanceof Error) {
        console.error(e.message)
      }
      return FAILING_STATUS
    }
  }

  async function getPastStatuses (timestamp: Date): Promise<Status[] | false> {
    try {
      const result = await collection.find({ created_at: { $gt: timestamp } }).toArray();
      if (!result?.length) {
        return false
      }
      return result.map(doc => {
        const { _id, ...rest } = doc
        return rest
      }) as Status[]
    } catch (e) {
      console.error('Could not fetch current server status')
      if (e instanceof Error) {
        console.error(e.message)
      }
      return false
    }
  }

  async function insertStatus (status: Status) {
    const date = new Date();
    date.setSeconds(0)
    date.setMilliseconds(0)

    await collection.insertOne({ ...status, created_at: date } as OptionalUnlessRequiredId<StatusDocument>);
  }

  async function closeConnection () {
    if (cachedClient) {
      await cachedClient.close()
      cachedClient = null
      cachedDb = null
    }
  }

  return {
    getLastStatus,
    getPastStatuses,
    insertStatus,
    closeConnection
  }
}

