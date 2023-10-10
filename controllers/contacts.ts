import { Request, Response } from "https://deno.land/x/oak/mod.ts";

interface Contact {
  email: string;
  message: string;
}

const kv = await Deno.openKv();

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
      await kv.set(["messages", contact.email], contact);
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
