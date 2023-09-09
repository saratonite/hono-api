import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { eq } from "drizzle-orm";
import { greet } from "./lib/msg";
import { db, people } from "./lib/db";

const app = new Hono();
app.get("/", (c) => c.text("Hello Hono!"));

// JSON Response
app.get("/json", (c) => c.json({ message: greet("") }));

// Basic auth
app.get(
  "/auth-basic",
  basicAuth({ username: "sarath", password: "sarath" }),
  (c) => c.text(greet("Sarath"))
);

app.get("/peoples", async (c) => {
  let peoples = await db.select().from(people);

  console.log("peoples", peoples);
  return c.json({ peoples });
});

app.post("/peoples", async (c) => {
  let body = await c.req.json();

  let _people = await db.insert(people).values(body).returning();

  return c.json(_people);
});

app.put("/peoples/:id", async (c) => {
  let id = c.req.param("id");
  let body = await c.req.json();

  let _people = await db
    .update(people)
    .set(body)
    .where(eq(people.id, Number(id)))
    .returning();

  return c.json(_people);
});

serve({
  port: 8000,
  fetch: app.fetch,
});

console.log(`Listening on 0.0.0.0:8000`);
