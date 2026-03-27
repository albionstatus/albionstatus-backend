import { defineHandler } from "void";

export const GET = defineHandler(() => {
  return { message: "This API works!" };
});
