import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { adminAuth } from "@/lib/middleware/adminAuth";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Department admin auth
    const admin = adminAuth(req); // { role, department }

    /**
     * STEP 1: Get all events hosted by this department
     */
    const departmentEvents = await Event.find(
      { department: admin.department },
      { _id: 1 }
    );

    const eventIds = departmentEvents.map(e => e._id);

    /**
     * STEP 2: Get registrations for those events
     */
    const registrations = await Registration.find({
      eventId: { $in: eventIds },
    })
      .populate("eventId", "title department type")
      .sort({ createdAt: -1 });

    return Response.json(
      {
        count: registrations.length,
        registrations,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Dept Admin Registrations Error:", err.message);
    return Response.json(
      { message: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}