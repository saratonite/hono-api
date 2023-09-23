import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { greet } from "./lib/msg";
import { poweredBy } from "./middlewares";
import peopleModule from "~/modules/people";

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

app.route("/peoples", peopleModule.peopleRoutes);

serve({
  port: 8000,
  fetch: app.fetch,
});

console.log(`Listening on 0.0.0.0:8000`);
