import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/middleware/adminAuth";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    // Admin authentication
    const admin = adminAuth(req);

    // Extract eventId from URL
    const url = new URL(req.url);
    const pathname = url.pathname; // e.g. /api/admin/events/697ca0dee8c3a9148b44465f
    const segments = pathname.split("/"); 
    const eventId = segments[segments.length - 1]; // last segment is eventId

    if (!eventId) {
      return NextResponse.json({ message: "Event ID required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: "Invalid Event ID" }, { status: 400 });
    }

    const event = await Event.findOne({
      _id: eventId,
      department: admin.department,
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Fetch single event error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
