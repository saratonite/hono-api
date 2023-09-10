import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { greet } from "./lib/msg";
import models from "./models";
import { poweredBy } from "./middlewares";

const app = new Hono();

app.use("*", poweredBy);
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
  let peoples = await models.people.list();

  return c.json({ peoples });
});

app.post("/peoples", async (c) => {
  let body = await c.req.json();

  let _people = await models.people.create(body);

  return c.json(_people);
});

app.put("/peoples/:id", async (c) => {
  let id = c.req.param("id");
  let body = await c.req.json();

  let _people = await models.people.updateById(Number(id), body);

  return c.json(_people);
});

serve({
  port: 8000,
  fetch: app.fetch,
});

console.log(`Listening on 0.0.0.0:8000`);
