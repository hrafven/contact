import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

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
  request: any;
  response: any;
}) => {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body();
      const contact = await body.value;
      await contacts.insertOne(contact);
      response.status = 201;
      response.body = {
        success: true,
        data: contact,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export default addContact;
