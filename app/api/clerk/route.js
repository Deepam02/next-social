import { headers } from "next/headers";
import { createUser, deleteUser, updateUser } from "@/actions/user";
import { Webhook } from "svix";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("no webhook found");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log("Webhook payload received:", payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;
  console.log("Event type:", eventType);

  const { id, first_name, last_name, email_addresses, image_url, username } =
    evt.data;

  const email_address = email_addresses?.[0].email_address;
  console.log("User data to be processed:", {
    id,
    first_name,
    last_name,
    email_address,
    image_url,
    username,
  });

  if (eventType === "user.created") {
    try {
      console.log("Attempting to create user...");
      const result = await createUser({
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      });
      
      if (result?.error) {
        console.error("Error creating user:", result.error);
        return new Response(JSON.stringify({ error: result.error }), {
          status: 500,
        });
      }
      
      console.log("Create user result:", result);
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response(JSON.stringify({ error: "Failed to save new user in db" }), {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    try {
      const result = await updateUser({
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      });
      
      if (result?.error) {
        console.error("Error updating user:", result.error);
        return new Response(JSON.stringify({ error: result.error }), {
          status: 500,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response(JSON.stringify({ error: "Failed to update user in db" }), {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      const result = await deleteUser({ id });
      
      if (result?.error) {
        console.error("Error deleting user:", result.error);
        return new Response(JSON.stringify({ error: result.error }), {
          status: 500,
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response(JSON.stringify({ error: "Failed to delete user in db" }), {
        status: 500,
      });
    }
  }

  return Response.json({ message: "received" });
}

export async function GET() {
  return Response.json({ message: "Hello" });
}
