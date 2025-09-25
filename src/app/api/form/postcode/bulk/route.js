import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Postcode from "../../../../helper/models/postcode";
import { ConnectDb } from "../../../../helper/db";

export async function POST(req) {
  try {
    await ConnectDb();

    const data = await req.formData();
    const file = data.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Expect rows like [{ postcode: "12345" }]
    const docs = rows.map((r) => ({ postcode: r.postcode }));

    await Postcode.insertMany(docs, { ordered: false });

    return NextResponse.json({ success: true, count: docs.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 });
  }
}
