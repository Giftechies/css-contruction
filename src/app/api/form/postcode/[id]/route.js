import { ConnectDb } from "../../../../helper/db";
import Postcode from "../../../../helper/models/postcode";

// UPDATE
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const body = await req.json();
    console.log("update>>>>>",body);
    
    const updated = await Postcode.findByIdAndUpdate(params.id, body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    await Postcode.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
