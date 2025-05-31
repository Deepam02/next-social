import { headers } from "next/headers";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("no webhook found");
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix_id");
  const svix_timestamp = (await headerPayload).get("svix_timestamp");
  const svix_signature = (await headerPayload).get("svix_signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

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
  console.log(eventType)

  // const { id, first_name, last_name, email_addresses, image_url, username } =  evt.data;

  // const email_address = email_addresses?.[0].email_address;
}

export async function GET() {
  return Response.json({ message: "Hello" });
}
