import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();

  const { eventId } = await params;

  const event = await Event.findById(eventId).lean();

  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}
