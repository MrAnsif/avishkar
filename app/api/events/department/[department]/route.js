import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

// GET department-wise public events
export async function GET(req, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;
    console.log("📦 Resolved params:", resolvedParams);
    
    const { department } = resolvedParams;
    console.log("🎯 Department:", department);
    console.log("🔍 Lowercase:", department?.toLowerCase());

    if (!department) {
      return NextResponse.json(
        { message: "Department is required" },
        { status: 400 }
      );
    }

    const query = {
      eventCategory: "department",
      department: department.toLowerCase(),
      isActive: true,
    };
    console.log("🔎 MongoDB Query:", query);

    const events = await Event.find(query)
    //   .select("_id title description imageUrl type teamSize amount startTime")
      .sort({ startTime: 1 })
      .lean();

    console.log("✅ Found events:", events.length);

    return NextResponse.json(
      { events },
      { status: 200 }
    );
  } catch (error) {
    console.error("DEPARTMENT EVENTS FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch department events" },
      { status: 500 }
    );
  }
}