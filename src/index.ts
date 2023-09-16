import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { greet } from "./lib/msg";
import models, { CreateInput } from "./models";
import { poweredBy } from "./middlewares";
import { people } from "./lib/db";

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

// Create new
app.post(
  "/peoples",
  zValidator(
    "json",
    z.object({
      name: z.string().nonempty(),
      email: z.string().email(),
      phone: z.string().optional().default(""),
    })
  ),
  async (c) => {
    let body = await c.req.valid("json");

    let _people = await models.people.create(body as CreateInput);

    return c.json(_people);
  }
);

app.put("/peoples/:id", async (c) => {
  let id = c.req.param("id");

  let body = await c.req.json();

  let _people = await models.people.updateById(Number(id), body);

  return c.json(_people);
});

app.delete("/peoples/:id", async (c) => {
  let id = c.req.param("id");
  let _people = await models.people.remove(Number(id));

  if (!_people) {
    return c.json({ message: "Not found." }, 404);
  }
  return c.json(_people);
});

serve({
  port: 8000,
  fetch: app.fetch,
});

console.log(`Listening on 0.0.0.0:8000`);
