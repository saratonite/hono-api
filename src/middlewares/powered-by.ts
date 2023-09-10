import { Context, Next } from "hono";
export async function poweredBy(c: Context, next: Next) {
  c.res.headers.set("x-powered-by", "Sarath");
  await next();
}
