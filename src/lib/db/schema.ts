import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const people = sqliteTable("peoples", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("emil"),
  phone: text("phone"),
});

export type People = typeof people.$inferInsert;
