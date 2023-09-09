import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { greet } from "./lib/msg";

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

serve({
  port: 8000,
  fetch: app.fetch,
});
