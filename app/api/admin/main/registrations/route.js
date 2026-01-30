import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { mainAdminAuth } from "@/lib/middleware/mainAdminAuth";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Main admin auth
    mainAdminAuth(req);

    const registrations = await Registration.find()
      .populate({
        path: "eventId",
        select: "title department",
      })
      .sort({ createdAt: -1 });

    return Response.json(
      {
        count: registrations.length,
        registrations,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}