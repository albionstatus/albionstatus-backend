import { FAILING_STATUS } from './constants.js'
import { ServerName, Status } from './types.js'
import { MongoClient, ObjectId } from "mongodb";

export type StatusDocument = Status & {
  id: ObjectId
  _id?: string
  created_at: Date
}

type CreateDbClientArgs = {
  connection: string,
  database: string,
  server: ServerName
}
export async function createDbClient ({ connection, database, server }: CreateDbClientArgs) {
  const client = new MongoClient(connection)
  await client.connect()
  const db = client.db(database);
  const collection = db.collection(`server_${server}`);

  async function getLastStatus (): Promise<Status> {
    try {
      const result = await collection.findOne<StatusDocument>({});
      if (!result) {
        return {
          type: 'unknown',
          message: 'No entries yet, the bot is probably booting up',
          comment: 'booting up',
        }
      }
      const { _id: _, ...status } = result
      return status
    } catch (e) {
      console.error('Could not fetch current server status')
      console.error(e)
      return FAILING_STATUS
    }
  }

  async function getPastStatuses (timestamp: Date): Promise<Status[] | false> {
    try {
      const result = await collection.find<StatusDocument>({ created_at: { $gt: timestamp } }).toArray();
      if (!result?.length) {
        return false
      }
      return result.map(({ id: _, ...status }) => status)
    } catch (e) {
      console.error('Could not fetch current server status')
      console.error(e)
      return false
    }
  } 

  async function insertStatus (status: Status) {
    const date = new Date();
    date.setSeconds(0)
    date.setMilliseconds(0)

    await collection.insertOne({ ...status, created_at: date });
  }

  async function close () {
    await client.close()
  }

  return {
    getLastStatus,
    getPastStatuses,
    insertStatus,
    close
  }
}

