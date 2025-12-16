import { HTTPError } from "nitro/h3";
import { createDbClient } from "../../../shared/db.js";
import type { ServerName } from "../../../shared/types.js";
import { defineCachedHandler } from "nitro/cache";
import { useRuntimeConfig } from "nitro/runtime-config";
import { validateServer } from "../../utils/server.js";

const { mongodbUri: rawMongoUri } = useRuntimeConfig();
console.log({rawMongoUri});
// @ts-expect-error NITRO_MONGODB_URI is injected by Cloudflare Workers
const mongoUri = rawMongoUri || (NITRO_MONGODB_URI as string);
export default defineCachedHandler(
  async (event) => {
    const { server } = event.context.params;

    validateServer(server)

    const { getLastStatus } = await createDbClient({
      mongoUri,
      server: server as ServerName,
    });

    try {
      const result = await getLastStatus();
      console.log({ result });
      return result;
    } catch (e) {
      console.error(e, "ERROR");
      throw new HTTPError({
        status: 500,
        message: "Could not get last status",
      });
    }
  },
  {
    swr: true,
    maxAge: 30,
    staleMaxAge: 60,
  }
);
