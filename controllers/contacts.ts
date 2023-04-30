import { MongoClient } from "https://deno.land/x/mongo/mod.ts";
import { Request, Response } from "https://deno.land/x/oak@v12.3.0/mod.ts";

const MONGO_URI = Deno.env.get("MONGO_URI");
if (!MONGO_URI) throw new Error("MONGO_URI not found");
const URI = MONGO_URI;

interface Contact {
  _id: { $oid: string };
  email: string;
  message: string;
}

// Mongo Connection Init
const client = new MongoClient();
try {
  await client.connect(URI);
  console.log("Database successfully connected");
} catch (err) {
  console.log(err);
}

const db = client.database("contactsApp");
const contacts = db.collection<Contact>("contacts");

// DESC: ADD single contact
// METHOD: POST /
const addContact = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = request.body();
      let contact = await body.value;
      if (body.type === "form") {
        contact = Object.fromEntries(contact.entries());
      } else if (body.type === "json") {
        contact = JSON.stringify(contact);
      }
      await contacts.insertOne(contact);
      response.status = 201;
      if (body.type === "form") {
        response.body =
          `<p style="color:white;text-align:center">Contact request sent!</p>`;
        response.headers.set("Content-Type", "text/html");
      } else if (body.type === "json") {
        response.body = {
          success: true,
          data: contact,
        };
      }
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export default addContact;
