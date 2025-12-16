import { HTTPError } from "nitro/h3";
import { SERVER_NAMES } from "../../shared/types.js";

export function validateServer(server: string) {
  console.log('validating server:', server);
  const isValidServer = SERVER_NAMES.includes(
    server as (typeof SERVER_NAMES)[number]
  );
  
  if (!isValidServer) {
    throw new HTTPError({
      status: 400,
      message: "bad request",
    });
  }
}
