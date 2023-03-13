import { FAILING_STATUS } from './constants.js'
import { ServerName, Status } from './types.js'
import { App, Credentials } from "realm-web";

type Document = globalThis.Realm.Services.MongoDB.Document;

export type StatusDocument = Status & {
  created_at: Date
} & Document

type CreateDbClientArgs = {
  appId: string,
  apiKey?: string
  server: ServerName,
}
export async function createDbClient ({ appId: connection, server, apiKey }: CreateDbClientArgs) {
  const app = new App(connection)
  const credentials = apiKey ? Credentials.apiKey(apiKey) : Credentials.anonymous();
  const user = await app.logIn(credentials);
  const client = user.mongoClient('mongodb-atlas');
  const collection = client.db('albionstatus').collection<StatusDocument>(`server_${server}`);

  async function getLastStatus (): Promise<Status> {
    try {
      const result = await collection.findOne({}, { sort: { created_at: -1 }, projection: { '_id': false } });
      if (!result) {
        return {
          type: 'unknown',
          message: 'No entries yet, the bot is probably booting up',
          comment: 'booting up',
        }
      }
      return result
    } catch (e) {
      console.error('Could not fetch current server status')
      console.error(e)
      return FAILING_STATUS
    }
  }

  async function getPastStatuses (timestamp: Date): Promise<Status[] | false> {
    try {
      const result = await collection.find({ created_at: { $gt: timestamp } }, { projection: { '_id': false } });
      if (!result?.length) {
        return false
      }
      return result
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

  return {
    getLastStatus,
    getPastStatuses,
    insertStatus
  }
}

