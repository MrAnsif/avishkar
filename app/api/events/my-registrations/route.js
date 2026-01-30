import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET all registrations of the logged-in user
export async function GET(req) {
  try {
    await connectDB();

    // 🔐 FIX: Must await auth()
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

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