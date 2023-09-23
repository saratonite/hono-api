import { Hono, zValidator, z } from "~/core";
import models, { CreateInput } from "~/models";
let routes = new Hono();

routes.get("/", async (c) => {
  let peoples = await models.people.list();

  return c.json({ peoples });
});

// Create new
routes.post(
  "/",
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

routes.put("/:id", async (c) => {
  let id = c.req.param("id");

  let body = await c.req.json();

  let _people = await models.people.updateById(Number(id), body);

  return c.json(_people);
});

routes.delete("/:id", async (c) => {
  let id = c.req.param("id");
  let _people = await models.people.remove(Number(id));

  if (!_people) {
    return c.json({ message: "Not found." }, 404);
  }
  return c.json(_people);
});

export default routes;
