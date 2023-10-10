/// <reference lib="deno.unstable" />
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import addContact from "./controllers/contacts.ts";

const PORT: number = parseInt(Deno.env.get("PORT") || "8080");

const router = new Router();
router.post("/", addContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT });
