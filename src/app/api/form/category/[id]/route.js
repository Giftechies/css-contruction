import { NextResponse } from "next/server";
import { ConnectDb } from "../../../../helper/db";
import Category from "../../../../helper/models/category";

// READ one category
export async function GET(req, { params }) {
  try {
    await ConnectDb();
    const category = await Category.findById(params.id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE category
export async function PUT(req, { params }) {
  try {
    await ConnectDb();
    const body = await req.json();
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({success:true,data:category});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE category
export async function DELETE(req, { params }) {
  try {
    await ConnectDb();
    const category = await Category.findByIdAndDelete(params.id);
    if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
