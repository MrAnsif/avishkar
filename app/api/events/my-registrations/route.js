import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    await connectDB();

    // ✅ Clerk cookie-based auth (same as registration route)
    const { userId } = await auth();

    if (!userId) {
      console.log("MY-REGISTRATIONS API - No authenticated user");
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    console.log("MY-REGISTRATIONS API - UserId:", userId);

    // Find registrations of this user and populate event details
    const registrations = await Registration.find({ userId })
      .populate({
        path: "eventId",
        model: Event,
        select: "title description imageUrl amount type teamSize rules upiId department eventCategory"
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { registrations },
      { status: 200 }
    );
  } catch (err) {
    console.error("MY REGISTRATIONS FETCH ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch registrations", error: err.message },
      { status: 500 }
    );
  }
}