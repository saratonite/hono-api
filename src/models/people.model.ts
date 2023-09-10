import { eq } from "drizzle-orm";
import { db, people, People } from "../lib/db";

type CreateInput = Omit<People, "id">;
async function create(data: CreateInput) {
  let _people = await db.insert(people).values(data).returning().get();
  return _people;
}
async function updateById(id: number, data: CreateInput) {
  let _people = await db
    .update(people)
    .set(data)
    .where(eq(people.id, Number(id)))
    .returning()
    .get();

  return _people;
}
async function list() {
  let peoples = await db.select().from(people);
  return peoples;
}

export default {
  create,
  updateById,
  list,
};
