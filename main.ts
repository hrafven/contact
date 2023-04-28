import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import addContact from "./controllers/contacts.ts";

const PORT = Deno.env.get("PORT");

const router = new Router();
router.post("/", addContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT || 8080 });
