import { defineConfig } from "vite-plus";
import { voidPlugin } from "void";

export default defineConfig({
  plugins: [voidPlugin()],
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
