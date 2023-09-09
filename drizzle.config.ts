import { Config } from "drizzle-kit";
export default {
  schema: "./src/lib/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
  out: "./src/migrations",
} satisfies Config;
